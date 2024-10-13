from flask import Flask, request, jsonify
from pymongo import MongoClient
from gradio_client import Client
import datetime
import logging
import re
from bson import json_util
import json
from flask_cors import CORS

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# MongoDB setup
mongo_client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB connection string
db = mongo_client['alz']
users_collection = db['users']

# Gradio client setup
gradio_client = Client("slug220/drown")

def create_user(user_id, base_info, tasks):
    new_user = {
        '_id': user_id,
        'base_info': base_info,
        'tasks': tasks,
        'actions': [],
        'created_at': datetime.datetime.now()
    }
    result = users_collection.insert_one(new_user)
    logging.info(f"Created new user with ID: {result.inserted_id}")
    return new_user

def get_or_create_user(user_id, base_info=None, tasks=None):
    user = users_collection.find_one({'_id': user_id})
    if not user:
        if base_info is None or tasks is None:
            raise ValueError("Base info and tasks must be provided for new users")
        user = create_user(user_id, base_info, tasks)
        logging.info(f"Created new user with ID: {user_id}")
    else:
        logging.info(f"Retrieved existing user with ID: {user_id}")
    return user

def update_user_actions(user_id, action):
    today = datetime.datetime.now().date()
    result = users_collection.update_one(
        {'_id': user_id},
        {'$push': {'actions': {'action': action, 'timestamp': datetime.datetime.now(), 'date': today}}}
    )
    logging.debug(f"Updated user {user_id} actions. Modified count: {result.modified_count}")
    if result.modified_count == 0:
        logging.error(f"Failed to update actions for user {user_id}")
    return result.modified_count > 0

def get_today_actions(user_id):
    today = datetime.datetime.now().date()
    user = users_collection.find_one({'_id': user_id})
    if user and 'actions' in user:
        actions = [action for action in user['actions'] if action['date'] == today]
        logging.debug(f"Retrieved {len(actions)} actions for today for user {user_id}")
        return actions
    logging.debug(f"No actions found for today for user {user_id}")
    return []

def generate_system_message(user_id):
    user = users_collection.find_one({'_id': user_id})
    if not user:
        return "You are a friendly and helpful chatbot for a person with Alzheimer's."

    base_info = user.get('base_info', {})
    tasks = user.get('tasks', [])
    today_actions = get_today_actions(user_id)

    # Calculate remaining tasks
    task_counts = {task: tasks.count(task) for task in set(tasks)}
    for action in today_actions:
        task = action['action']
        if task in task_counts:
            task_counts[task] -= 1
            if task_counts[task] <= 0:
                del task_counts[task]

    system_message = f"You are a friendly chatbot helping {user_id} remember to complete their tasks for the day. {user_id} is the only user you will talk to"
    system_message += base_info

    if task_counts:
        remaining_tasks = ", ".join([f"{task} ({count})" for task, count in task_counts.items()])
        system_message += f"The person's remaining tasks include: {remaining_tasks}. "

    if today_actions:
        action_messages = [f"{action['action']} on {action['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}" for action in today_actions]
        system_message += "Today's actions: " + ", ".join(action_messages) + ". "

    system_message += "Limit responses to 15 words max"
    
    logging.debug(f"Generated system message for user {user_id}: {system_message}")
    return system_message

def detect_action(user_id, message):
    user = users_collection.find_one({'_id': user_id})
    if not user:
        return None

    tasks = user.get('tasks', [])
    action_patterns = [
        r"I have (.+)",
        r"I've (.+)",
        r"I just (.+)",
        r"I recently (.+)"
    ]
    for pattern in action_patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            action = match.group(1)
            if action in tasks:
                return action
    return None

def chat_with_gradio(user_id, message, max_tokens=512, temperature=0.7, top_p=0.95):
    # Check if the message indicates an action and update user data
    action = detect_action(user_id, message)
    if action:
        success = update_user_actions(user_id, action)
        if success:
            logging.info(f"Action detected and saved for user {user_id}: {action}")
        else:
            logging.error(f"Failed to save action for user {user_id}: {action}")
    else:
        logging.debug(f"No action detected in message: {message}")
    
    # Generate system message after potentially updating actions
    system_message = generate_system_message(user_id)
    
    try:
        result = gradio_client.predict(
            message,
            system_message,
            max_tokens,
            temperature,
            top_p,
            api_name="/chat"
        )
        
        return result
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None

# Custom JSON encoder to handle MongoDB ObjectId and datetime
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return json_util.default(obj)

# Flask routes
@app.route('/user', methods=['POST'])
def create_or_get_user():
    data = request.json
    try:
        user = get_or_create_user(data['user_id'], data.get('base_info'), data.get('tasks'))
        return json.dumps(user, cls=MongoJSONEncoder), 200, {'Content-Type': 'application/json'}
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    response = chat_with_gradio(data['user_id'], data['message'])
    return jsonify({'response': response}), 200

@app.route('/action', methods=['POST'])
def add_action():
    data = request.json
    success = update_user_actions(data['user_id'], data['action'])
    return jsonify({'success': success}), 200 if success else 500

@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = users_collection.find_one({'_id': user_id})
    if user:
        return json.dumps(user, cls=MongoJSONEncoder), 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/user/<user_id>/tasks', methods=['PUT'])
def update_tasks(user_id):
    data = request.json
    result = users_collection.update_one(
        {'_id': user_id},
        {'$set': {'tasks': data['tasks']}}
    )
    if result.modified_count > 0:
        return jsonify({'success': True}), 200
    else:
        return jsonify({'error': 'User not found or tasks not updated'}), 404

if __name__ == '__main__':
    app.run(debug=True)
# MemoMe App

MemoMe is a web application designed to assist in caring for individuals with Alzheimer's, Dementia, or other Memory Impairment. It provides a user-friendly interface for caregivers and patients to manage daily tasks and communicate effectively.

## Features

### Front Page (`FrontPage`)
- Welcome to MemoME and logo
- User text input field to login automatically without need to press any buttons
- Alternatively, a caregiver may click the register button, which links to HomePage, to create a new profile for a patient.
- Additionally, there's a check-in button, which links to the HelperPage, in case they want to view their patients' system inputs.

### Home Page (`HomePage`)
- User registration form with fields for:
  - Name
  - Important information
  - Helper's email
  - Tasks (comma-separated)
- Submits user data to the backend
- Navigates to the Task Display page after successful registration

### Task Display Page (`TaskDisplay`)
- Displays the user's tasks
- Implements speech recognition for user input
- Sends recognized speech to a chat endpoint
- Displays chat responses
- Uses text-to-speech to read out the chat responses

### Helper Page (`HelperPage`)
- Allows helpers to view user inputs by entering their email
- Categorizes and displays user inputs as:
  - Urgent: Contains words like "help", "emergency", "urgent", etc.
  - Action: Contains words like "completed", "finished", "done", etc.
  - Other: All other inputs
- Provides a "Read More" option to view additional inputs

## Technical Stack

- Frontend: React.js
- Backend: Flask (Python)
- Database: MongoDB
- APIs: 
  - Web Speech API for speech recognition
  - Gradio API for chat functionality

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install  # For frontend
   pip install -r requirements.txt  # For backend
   ```
3. Start the backend server:
   ```
   python app.py
   ```
4. Start the frontend development server:
   ```
   npm start
   ```

## Usage

1. Open the app in a web browser
2. On the Home Page, enter user details and tasks
3. Submit the form to create a user profile
4. Use the Task Display page to view tasks and interact with the voice assistant
5. Helpers can use the Helper Page to monitor user inputs and activities

This app is a prospective design for standalone devices such as TVs, smartwatches, and wireless earplugs, which will be more accessible to the user.

## Note

This application is designed for local use and may require additional security measures before deployment in a production environment.

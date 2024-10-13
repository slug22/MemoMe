import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function HelperPage() {
    const [helperEmail, setHelperEmail] = useState('');
    const [inputs, setInputs] = useState([]);
    const [error, setError] = useState('');
    const [showAll, setShowAll] = useState(false);

    const handleHelperEmailChange = (e) => {
        setHelperEmail(e.target.value);
    };

    const handleFetchInputs = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/helper/${helperEmail}/inputs`);
            const sortedInputs = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setInputs(sortedInputs);
            setError('');
        } catch (err) {
            setError('Failed to fetch user inputs. Please check the helper email.');
        }
    };

    const categorizeInput = (input) => {
        const helpWords = ["help", "emergency", "urgent", "panic", "scared", "lost", "confused"];
        const actionVerbs = ["completed", "finished", "done", "did", "accomplished", "achieved"];

        if (helpWords.some(word => input.text.toLowerCase().includes(word))) {
            return 'urgent';
        }
        if (actionVerbs.some(verb => input.text.toLowerCase().includes(verb))) {
            return 'action';
        }
        return 'other';
    };

    const handleShowMore = () => {
        setShowAll(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="App">
            <div className="container">
                <h1>Helper Page</h1>
                <input
                    type="email"
                    value={helperEmail}
                    onChange={handleHelperEmailChange}
                    placeholder="Enter helper email"
                />
                <button onClick={handleFetchInputs} style={{ marginBottom: '20px' }}>Fetch Inputs</button>
                {error && <p className="error">{error}</p>}
                <div className="inputs-list-container">
                    <div className="inputs-list">
                        {inputs.slice(0, showAll ? inputs.length : 5).map((input, index) => {
                            const category = categorizeInput(input);
                            return (
                                <div key={index} className={`input-item ${category}`}>
                                    <p>{input.text}</p>
                                    <span>{new Date(input.timestamp).toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                    {inputs.length > 5 && !showAll && (
                        <button onClick={handleShowMore}>Read More</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HelperPage;
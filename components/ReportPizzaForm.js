import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


const ReportPizzaForm = () => {
  const [userName, setUserName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const id = uuidv4();
    const reportData = {
      id,
      date,
      userName,
      location,
      description,
      urgencyLevel,
    };

    try {
      const response = await fetch('api/reportForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      }); 
      
      // Reset form fields after submission
      if (response.ok){  
        setUserName('');
        setDate('');
        setLocation('');
        setDescription('');
        setUrgencyLevel('');
      } else {
        console.error('Error creating ticket:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
    //why no res.send(200 status) here????
  };

  return (
    <div className="report-pizza-form">
      <h2>Report Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">User Name (Optional):</label> 
          
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date of Incident:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location of Problem:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="urgencyLevel">Urgency Level:</label>
          <select
            id="urgencyLevel"
            value={urgencyLevel}
            className="clean-dropdown" 
            onChange={(e) => setUrgencyLevel(e.target.value)}
          >
            <option value="">Select urgency level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReportPizzaForm;
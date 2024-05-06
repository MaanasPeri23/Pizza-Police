import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchData } from 'next-auth/client/_utils';

//extracting fields into state variables
const Report = ({ report, onDelete, onReply, onEdit}) => {
  const [reply, setReply] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [comment, setComment] = useState('');

  const handleEdit = (urgencyLevel) => {
    onEdit(report.id, urgencyLevel);
    setUrgencyLevel(urgencyLevel);
  }
  const handleDelete = () => {
    onDelete(report.id);
  };

  const handleReply = () => {
    const fullComment = { ...comment, comment};
    onReply(report.id, fullComment.comment); //need to pass in 2 things here
    alert('Email of ticket has been sent! User will see updated status of this ticket along with additional comments. ');
    setComment('');
  };

  return (
    <div className="report-item">
      <div className="urgency-level">
        <label htmlFor={`urgencyLevel`}>Urgency Level:</label>
        <select
          className='clean-dropdown-2'
          id={`urgencyLevel`}
          value={report.urgencyLevel}
          onChange={(e) => handleEdit(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="report-header">
        <div className="report-info">
          <h3>{report.user}</h3>
          <p>{report.date}</p>
          <p>{report.location}</p>
        </div>
        <div className="report-actions">
          {report.resolved ? (
            <span className="resolved">Resolved</span>
          ) : (
            <button onClick={handleDelete}>Resolve</button>
          )}
        </div>
      </div>
      <div className="report-description">
        <p>{report.description}</p>
      </div>
      <div className="comments-section">
        <h4>Comments:</h4>
        <ul>
          {report.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
      <div className="reply-section">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Reply..."
        />
        <button onClick={handleReply}>Add Comment</button>
      </div>
    </div>
  );
};

//passing in extracted fields into the API calls and updating database accordingly. fetchData() keeps loading
const AdminView = () => {
  const [reports, setReports] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Fetch tickets when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/reportForm');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/reportForm?ticketID=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // console.log('Ticket deleted:', id);
        await fetchData();
      } else {
        console.error('Error deleting ticket:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }

  };

  const handleEdit = async (ticketID, urgencyLevel) => {
    try {

      const response = await fetch(`/api/reportForm?ticketID=${ticketID}&urgencyLevel=${urgencyLevel}`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchData();
      }else{
        console.error('Error updating ticket:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
    
  }

  const handleComment = async (ticketID, fullComment) => {

    try {
      const response = await fetch(`/api/comments?ticketID=${ticketID}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullComment)
      })
      if (response.ok) {
        // Fetch the updated reports after posting the comment
        await fetchData();
      } else {
        console.error('Error posting comment:', response.statusText);
      }
      
    } catch (error) {
      console.error('Error posting comment:', error);
    }

    
  };

  if (!session){
    return <div> Sorry! You're not signed in!</div>
  }

  return (
    <div className = "admin-view-container">
      <div className = "title"> 
        <h2>Admin View</h2>
      </div>
      <div className="admin-view">
        <div className="report-list">
          {reports.map((report) => (
            <Report
              key={report.id}
              report={report}
              onDelete={handleDelete}
              onReply={handleComment}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
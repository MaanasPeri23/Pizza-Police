import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

//extracting fields into state variables
export const Report = ({ report, onDelete, onDeleteComment, onReply, onEdit, onEditComment, onReactivate}) => {
    
    const [reply, setReply] = useState('');
    const [urgencyLevel, setUrgencyLevel] = useState(report.urgencyLevel || '');
    const [comment, setComment] = useState('');
  
    const [editingCommentID, setEditingCommentID] = useState(null);
    const [editingText, setEditingText] = useState('');

    if (!report) {
      return null; // or return a fallback UI
    }
  
    //editing comment handles
    const handleEditComment = (commentID, currentText) => {
      setEditingCommentID(commentID);
      setEditingText(currentText);
    };
    const handleEditCommentChange = (e) => {
      setEditingText(e.target.value);
    }
    const handleEditSubmitComment = () => {
      onEditComment(report.id, editingCommentID, { comment: editingText });
      setEditingCommentID(null);
      setEditingText('');
    };
  
  
  
    //editing urgency level
    const handleEdit = (urgencyLevel) => {
      onEdit(report.id, urgencyLevel);
      setUrgencyLevel(urgencyLevel);
    }
    const handleDelete = () => {
      onDelete(report.id);
    };
  
    const handleDeleteComment = (commentID) => {
      onDeleteComment(report.id, commentID)
    }
  
    const handleReply = () => {
      const fullComment = { ...comment, comment};
      onReply(report.id, fullComment.comment); //need to pass in 2 things here
      alert('Email of ticket has been sent! User will see updated status of this ticket along with additional comments. ');
      setComment('');
    };

    const reActivate = () => {
      onReactivate(report.id);
    }
  
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
            <h3>{report.user_name}</h3>
            <p>{report.date}</p>
            <p>{report.location}</p>
          </div>
          <div className="report-actions">
            {report.status == "Resolved" ? (
              <button className="resolve-button" onClick={reActivate}>Re-Activate</button>
            ) : (
              <button className="resolve-button" onClick={handleDelete}>Resolve</button>
            )}
          </div>
        </div>
        <p>Description: </p>
        <div className="report-description">
          <p>{report.description}</p>
        </div>
        <div className="comments-section">
          <h4>Comments:</h4>
          <ul className="comment-list">
            {report.comments.map((comment, index) => (
              <li key={index} className="comment-item">
                <div className="comment-header">
                  <span className="comment-user">{comment.submittedBy}</span>
                  <span className="comment-date">{comment.date}</span>
                  <div className="comment-actions">
                    <button className="edit-button" onClick={() => handleEditComment(comment.commentID, comment.comment)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteComment(comment.commentID)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <div className="comment-body">
                  {editingCommentID === comment.commentID ? (
                    <>
                      <textarea value={editingText} onChange={handleEditCommentChange} />
                      <button onClick={handleEditSubmitComment}>Save</button>
                    </>
                  )
                    : (
                      <p>{comment.comment}</p>
                  )}
                </div>
              </li>
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

export default Report;
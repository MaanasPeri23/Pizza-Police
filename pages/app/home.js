import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchData } from 'next-auth/client/_utils';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { v4 as uuidv4 } from 'uuid';

import Report from '../../components/individualReports.js';

//passing in extracted fields into the API calls and updating database accordingly. fetchData() keeps loading
export const AdminView = () => {
  const [inProgressReports, setReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [selectedTab, setSelectedTab] = useState('inProgress'); // Tab state
  const { data: session, status } = useSession();

  useEffect(() => {
    // Fetch tickets when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/reportForm');
      const data = await response.json();

      //sorting the tickets by urgency level, and then by date
      const sortedData = data.sort((a, b) => { //comparator function in sort method 
        const urgencyLevels = ['High', 'Medium', 'Low']; // use this to find the index of the urgency level to compare it with the other urgency level
        const urgencyLevelA = urgencyLevels.indexOf(a.urgencyLevel);
        const urgencyLevelB = urgencyLevels.indexOf(b.urgencyLevel);
        
        //if the urgency levels are different, sort based off of the urgency level. otherwise sort by date.
        if (urgencyLevelA !== urgencyLevelB) {
          return urgencyLevelA - urgencyLevelB; //sorting by urgencyLevel 
        } else {
          return new Date(b.date) - new Date(a.date); //sorting by date now
        }
      });

      const inProgressReports = sortedData.filter((report) => report.status != "Resolved");
      const resolvedReports = sortedData.filter((report) => report.status == "Resolved");
      
      setReports(inProgressReports);
      setResolvedReports(resolvedReports);
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

  const handleDeleteComment = async (ticketID, commentID) => {
    try {
      const response = await fetch(`/api/comments?ticketID=${ticketID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentID })
      });
      if (response.ok) {
        await fetchData();
      } else {
        console.error('Error deleting comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

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

    const commentID = uuidv4();
    try {
      const response = await fetch(`/api/comments?ticketID=${ticketID}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({commentID, fullComment})
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

  const handleEditComment = async (ticketID, commentID, updatedComment) => {
    try {
      const response = await fetch(`/api/comments?ticketID=${ticketID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentID, updatedComment }),
      });
      if (response.ok) {
        await fetchData();
      } else {
        console.error('Error updating comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const bringBackToLife = async (ticketID) => {
    try {
      const response = await fetch(`/api/reportForm?ticketID=${ticketID}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchData();
      } else {
        console.error('Error reactivating ticket:', response.statusText);
      }
    } catch (error) {
      console.error('Error reactivating ticket:', error);
    }
  }

  if (!session){
    return <div> Sorry! You&apos;re not signed in!</div>
  }

  return (
    <div className="admin-view-container">
      <div className="title">
        <h2>Admin View</h2>
      </div>
      <div className="tabs">
        <button
          className={`tab-button ${selectedTab === 'inProgress' ? 'active' : ''}`}
          onClick={() => setSelectedTab('inProgress')}
        >
          Tickets in Progress
        </button>
        <button
          className={`tab-button ${selectedTab === 'resolved' ? 'active' : ''}`}
          onClick={() => setSelectedTab('resolved')}
        >
          Resolved Tickets
        </button>
      </div>
      <div className="admin-view">
      <div className="reports-container">
          {selectedTab === 'inProgress' && (
            <div className="report-list">
              {inProgressReports.map((report) => (
                <Report
                  key={report.id}
                  report={report}
                  onDelete={handleDelete}
                  onDeleteComment={handleDeleteComment}
                  onReply={handleComment}
                  onEdit={handleEdit}
                  onEditComment={handleEditComment}
                  onReactivate={bringBackToLife}
                />
              ))}
            </div>
          )}
          {selectedTab === 'resolved' && (
            <div className="report-list">
              {resolvedReports.map((report) => (
                <Report
                  key={report.id}
                  report={report}
                  onDelete={handleDelete}
                  onDeleteComment={handleDeleteComment}
                  onReply={handleComment}
                  onEdit={handleEdit}
                  onEditComment={handleEditComment}
                  onReactivate={bringBackToLife}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
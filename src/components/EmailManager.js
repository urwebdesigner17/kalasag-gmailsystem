import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmailManager({ userToken }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

  const fetchEmails = async () => {
    if (!userToken) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/get-emails`, { token: userToken.access_token });
      setEmails(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmails(); }, [userToken]);

  // --- RESTORED ACTIONS TO MATCH YOUR BACKEND ---

  const handleArchive = async (id) => {
    try {
      await axios.post(`${API_URL}/api/archive-email`, { token: userToken.access_token, messageId: id });
      fetchEmails(); // Refresh list
    } catch (e) { alert("Archive failed"); }
  };

  const handleReadStatus = async (id, currentStatus) => {
    try {
      // isUnread should be true if we want to add the UNREAD label, false to remove it
      await axios.post(`${API_URL}/api/mark-unread`, {
        token: userToken.access_token,
        messageId: id,
        isUnread: false // Clicking "Mark Read" removes the label
      });
      fetchEmails();
    } catch (e) { alert("Status update failed"); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${API_URL}/api/delete-email`, { token: userToken.access_token, messageId: id });
      fetchEmails();
    } catch (e) { alert("Delete failed"); }
  };

  return (
    <div style={styles.container}>
      <h2>Manage Emails</h2>
      {loading ? <p>Loading...</p> : (
        <div>
          {Array.isArray(emails) && emails.map(m => (
            <div key={m.id} style={styles.row}>
              <div style={{ flex: 1 }}>{m.subject}</div>
              <div style={styles.actions}>
                <button onClick={() => handleReadStatus(m.id)} style={styles.btnRead}>Read</button>
                <button onClick={() => handleArchive(m.id)} style={styles.btnArchive}>Archive</button>
                <button onClick={() => handleDelete(m.id)} style={styles.btnDelete}>Trash</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  row: { display: 'flex', padding: '10px', borderBottom: '1px solid #ddd', alignItems: 'center', backgroundColor: '#fff' },
  actions: { display: 'flex', gap: '5px' },
  btnRead: { backgroundColor: '#4285f4', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnArchive: { backgroundColor: '#34a853', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnDelete: { backgroundColor: '#ea4335', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};

export default EmailManager;
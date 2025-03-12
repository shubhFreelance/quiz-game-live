import React, { useState } from 'react';
import '../styles/Dashboard.css'

const AddManager = () => {
  const [managers, setManagers] = useState([]);
  const [newManager, setNewManager] = useState('');

  const handleAddManager = (e) => {
    e.preventDefault();
    if (newManager.trim()) {
      setManagers([...managers, { id: managers.length + 1, name: newManager }]);
      setNewManager('');
    }
  };

  return (
    <div className="add-manager">
      <h1>Add Manager</h1>
      <form onSubmit={handleAddManager}>
        <input
          type="text"
          value={newManager}
          onChange={(e) => setNewManager(e.target.value)}
          placeholder="Enter manager's name"
          required
        />
        <button type="submit">Add Manager</button>
      </form>

      <div className="manager-list">
        <h2>Existing Managers</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id}>
                <td>{manager.id}</td>
                <td>{manager.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddManager;
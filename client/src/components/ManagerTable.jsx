import React from 'react';

const ManagerTable = () => {
  const managers = [
    { id: 1, name: 'Manager 1', data: { '1': 100, '2': 200, 'A': 300 } },
    { id: 2, name: 'Manager 2', data: { '3': 150, '4': 250, 'Q': 350 } },
  ];

  return (
    <div className="manager-tables">
      {managers.map((manager) => (
        <div key={manager.id} className="manager-table">
          <h3>{manager.name}</h3>
          <table>
            <thead>
              <tr>
                <th>Number/Alphabet</th>
                <th>Amount Collected</th>
                <th>Number of People</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(manager.data).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                  <td>{Math.floor(value / 10)}</td> {/* Example calculation */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ManagerTable;
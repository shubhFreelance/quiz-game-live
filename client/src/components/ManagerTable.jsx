import React from "react";

const ManagerTable = () => {
 
  return (
    <div className="manager-tables">
      {managers.map((manager) => (
        <div key={manager.id} className="manager-table">
          <h3 className="text-white">{manager.name}</h3>
          <table>
            <thead>
              <tr className="text-white">
                <th>Number/Alphabet</th>
                <th>Amount Collected</th>
                <th>Number of People</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(manager.data).map(([key, value]) => (
                <tr className="text-white" key={key}>
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

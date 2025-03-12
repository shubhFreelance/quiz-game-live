import React, { useState } from 'react';

const Results = () => {
  const [result, setResult] = useState('');
  const [resultsList, setResultsList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultsList([...resultsList, { date: new Date().toLocaleDateString(), result }]);
    setResult('');
  };

  return (
    <div className="results">
      <h1>Results Section</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="Enter today's result"
          required
        />
        <button type="submit">Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {resultsList.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
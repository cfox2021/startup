import React from 'react';

export default function Leaderboard() {
  return(
  <main>
    <h1>High Scores</h1>
    <p>Updated in real time via WebSocket</p>
    
    <div id="leaderboard-container">
      <table border="1">
        <thead>
          <tr><th>Rank</th><th>Username</th><th>Score</th><th>Date</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>username1</td><td>12000</td><td>2025-09-25</td></tr>
          <tr><td>2</td><td>username2</td><td>9500</td><td>2025-09-24</td></tr>
          <tr><td>3</td><td>username3</td><td>500</td><td>2025-09-25</td></tr>
        </tbody>
      </table>
    </div>
  </main>
  );
}
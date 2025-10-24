import React, { useState, useEffect } from 'react';
import '../app.css';

export default function Leaderboard({ loggedInUser }) {
  const [highscores, setHighscores] = useState([]);

  const updateHighscores = () => {
    const stored = JSON.parse(localStorage.getItem('highscores')) || {};
    setHighscores(
      Object.entries(stored)
        .map(([username, score]) => ({ username, score }))
        .sort((a, b) => b.score - a.score)
    );
  };

  // Load highscores on mount
  useEffect(() => {
    updateHighscores();

    // Listen for storage events (high score updates)
    const listener = () => updateHighscores();
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);

  return (
    <main>
      <h1>High Scores</h1>
      <p>Saved locally for each user</p>

      <div id="leaderboard-container">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {highscores.length === 0 && (
              <tr>
                <td colSpan="3">No highscores yet.</td>
              </tr>
            )}
            {highscores.map((entry, idx) => (
              <tr key={entry.username}>
                <td>{idx + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

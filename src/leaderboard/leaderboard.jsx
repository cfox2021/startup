import React, { useState, useEffect } from 'react';
import '../app.css';
import { apiGetLeaderboard } from '../api';

export default function Leaderboard({ loggedInUser }) {
  const [highscores, setHighscores] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const list = await apiGetLeaderboard();
      if (mounted) setHighscores(list);
    }
    load();
    const listener = () => load();
    window.addEventListener('leaderboardUpdate', listener);
    return () => { mounted = false; window.removeEventListener('leaderboardUpdate', listener); };
  }, []);

  return (
    <main>
      <h1>Leaderboard</h1>
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
                <td colSpan="3">No scores yet.</td>
              </tr>
            )}
            {highscores.map((entry, idx) => (
              <tr key={entry.username}>
                <td>{idx + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.bestScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

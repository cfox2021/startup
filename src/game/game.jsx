import React, { useState, useEffect } from 'react';
import '../app.css';

export default function Game() {
  const [handPressed, setHandPressed] = useState({ left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        setHandPressed(prev => ({ ...prev, left: true }));
        setTimeout(() => setHandPressed(prev => ({ ...prev, left: false })), 100);
      }
      if (e.key === 'j' || e.key === 'J') {
        setHandPressed(prev => ({ ...prev, right: true }));
        setTimeout(() => setHandPressed(prev => ({ ...prev, right: false })), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main>
      <div
        id="game-outline"
        style={{
          width: "960px",
          height: "720px",
          border: "2px solid #baffc9",
          backgroundColor: "black",
          position: "relative",
          overflow: "hidden",
          margin: "auto"
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "180px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none"
          }}
        >
          <img src="/monkey.png" alt="Monkey body" width="360" />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "180px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "flex-end",
            gap: "360px"
          }}
        >
          <img
            src="/hand_left.png"
            alt="Left hand"
            width="260"
            style={{
              transform: handPressed.left ? "translateY(40px)" : "translateY(0px)",
              transition: "transform 0.08s ease"
            }}
          />
          <img
            src="/hand_right.png"
            alt="Right hand"
            width="260"
            style={{
              transform: handPressed.right ? "translateY(40px)" : "translateY(0px)",
              transition: "transform 0.08s ease"
            }}
          />
        </div>
      </div>

      <section id="highscore">
        <h2>High Score</h2>
        <p>[Score grabbed from data base when player logs in, then WebSocket updates appear here when player gets new high score]</p>
      </section>

      <section id="third-party">
        <h2>Tutorial Video with YouTube Data API</h2>
        <details>
          <summary>Show tutorial</summary>
          <div id="video-outline" style={{ width: "640px", height: "360px", border: "1px solid black" }}>
            <p>[Tutorial Will be shown here.]</p>
          </div>
        </details>
      </section>
    </main>
  );
}

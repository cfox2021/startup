import React, { useState, useEffect } from 'react';
import '../app.css';

export default function Game() {
  const [handPressed, setHandPressed] = useState({ left: false, right: false });
  const [notes, setNotes] = useState([]);

  // Spawn falling notes
  useEffect(() => {
    const interval = setInterval(() => {
      const newNote = {
        id: Date.now(),
        side: Math.random() < 0.5 ? 'left' : 'right',
        y: 0,
      };
      setNotes(prev => [...prev, newNote]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Move notes downward
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setNotes(prev =>
        prev
          .map(note => ({ ...note, y: note.y + 7 }))
          .filter(note => note.y < 700)
      );
    }, 50);
    return () => clearInterval(moveInterval);
  }, []);

  // Key press handling
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

  // Layout constants
  const containerWidth = 960;
  const bongoWidth = 220;
  const bongoHeight = 220;
  const bongoGap = 550;
  const noteSize = 50;
  const hitZoneSize = 60;

  // Compute bongo horizontal positions
  const leftBongoLeft = containerWidth / 2 - bongoGap / 2 - bongoWidth / 2;
  const rightBongoLeft = containerWidth / 2 + bongoGap / 2 - bongoWidth / 2;
  const bongoBottom = 65;

  // Hit zone positioning
  const hitZoneTop = 700 - bongoBottom - bongoHeight + bongoHeight * 0.05; // raised higher
  const hitZoneHorizontalOffset = 110; // spread further apart

  return (
    <main>
      <div
        id="game-outline"
        style={{
          width: `${containerWidth}px`,
          height: "720px",
          border: "2px solid #baffc9",
          backgroundColor: "black",
          position: "relative",
          overflow: "hidden",
          margin: "auto"
        }}
      >
        {/* Falling notes */}
        {notes.map(note => {
          const leftPosition =
            note.side === 'left'
              ? containerWidth / 2 - bongoGap / 2 - bongoWidth / 2 - noteSize / 2
              : containerWidth / 2 + bongoGap / 2 + bongoWidth / 2 - noteSize / 2;

          return (
            <div
              key={note.id}
              style={{
                position: "absolute",
                left: `${leftPosition}px`,
                top: `${note.y}px`,
                width: `${noteSize}px`,
                height: `${noteSize}px`,
                borderRadius: "50%",
                backgroundColor: note.side === 'left' ? "red" : "blue",
                zIndex: 4,
              }}
            />
          );
        })}

        {/* Hit zones */}
        {[
          leftBongoLeft - hitZoneHorizontalOffset, 
          rightBongoLeft + hitZoneHorizontalOffset
        ].map((bongoLeft, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              width: `${hitZoneSize}px`,
              height: `${hitZoneSize}px`,
              borderRadius: "50%",
              border: "3px solid white",
              left: `${bongoLeft + bongoWidth / 2 - hitZoneSize / 2}px`,
              top: `${hitZoneTop}px`,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        ))}

        {/* Bongos */}
        <div
          style={{
            position: "absolute",
            bottom: `${bongoBottom}px`,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: `${bongoGap}px`,
            zIndex: 1,
          }}
        >
          <img src="/bongo_left.png" alt="Left bongo" width={bongoWidth} />
          <img src="/bongo_right.png" alt="Right bongo" width={bongoWidth} />
        </div>

        {/* Monkey */}
        <div
          style={{
            position: "absolute",
            bottom: "180px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <img src="/monkey.png" alt="Monkey body" width="360" />
        </div>

        {/* Hands */}
        <div
          style={{
            position: "absolute",
            bottom: "180px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "flex-end",
            gap: "360px",
            zIndex: 3,
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

      {/* Score / Combo / High Score Section */}
      <section id="scoreboard" style={{ width: `${containerWidth}px`, margin: "20px auto", textAlign: "center", color: "black" }}>
        <div id="current-score" style={{ fontSize: "28px", marginBottom: "10px" }}>
          Score: 0
        </div>
        <div id="combo" style={{ fontSize: "22px", marginBottom: "10px" }}>
          Combo: 0
        </div>
        <div id="high-score" style={{ fontSize: "24px" }}>
          High Score: 0
        </div>
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

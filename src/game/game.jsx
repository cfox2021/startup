import React, { useState, useEffect } from 'react';
import '../app.css';
import { apiSubmitScore } from '../api';
import { apiGetYouTubeVideo } from '../api';

function TutorialVideo({ videoId }) {
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGetYouTubeVideo(videoId);
        if (mounted) setVideoData(data);
      } catch (e) {
        if (mounted) setError(e.message);
      }
    })();
    return () => { mounted = false; };
  }, [videoId]);

  if (error) return <div style={{ color: 'red' }}>Error loading video: {error}</div>;
  if (!videoData) return <div>Loading video...</div>;

  return (
    <div style={{ textAlign: 'center', margin: '10px auto' }}>
      <h3>{"Random Video. Did not have time to make tutorial video."}</h3>
      <iframe
        width="640"
        height="360"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allowFullScreen
        title={videoData.title}
      />
    </div>
  );
}

export default function Game({ loggedInUser }) {
  const [handPressed, setHandPressed] = useState({ left: false, right: false });
  const [notes, setNotes] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [displayMultiplier, setDisplayMultiplier] = useState(1);
  const [running, setRunning] = useState(false); // new

  const containerWidth = 960;
  const bongoWidth = 220;
  const bongoHeight = 220;
  const bongoGap = 550;
  const noteSize = 50;
  const hitZoneSize = 60;
  const bongoBottom = 65;
  const hitZoneTop = 700 - bongoBottom - bongoHeight + bongoHeight * 0.05;
  const hitZoneHorizontalOffset = 110;

  const leftBongoLeft = containerWidth / 2 - bongoGap / 2 - bongoWidth / 2;
  const rightBongoLeft = containerWidth / 2 + bongoGap / 2 - bongoWidth / 2;

  const bongoSound = new Audio('/sounds/bongo.wav');

  // Spawn falling notes
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setNotes(prev => [...prev, { id: Date.now(), side: Math.random() < 0.5 ? 'left' : 'right', y: 0 }]);
    }, 1200);

    return () => clearInterval(interval);
  }, [running]);

  // Move notes downward
  useEffect(() => {
    if (!running) return;

    const fps = 60;
    const interval = 1000 / fps;
    const fallSpeed = 6;

    const moveInterval = setInterval(() => {
      setNotes(prev => {
        const newNotes = prev
          .map(note => ({ ...note, y: note.y + fallSpeed }))
          .filter(note => note.y < 700);

        const missed = prev.some(note => note.y > hitZoneTop + hitZoneSize);
        if (missed) {
          setCombo(0);
          setMultiplier(1);
          setDisplayMultiplier(1);
        }

        return newNotes;
      });
    }, interval);

    return () => clearInterval(moveInterval);
  }, [running, hitZoneTop]);

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!running) return; // stop key handling if game isn't running

      let side = null;
      if (e.key === 'f' || e.key === 'F') side = 'left';
      if (e.key === 'j' || e.key === 'J') side = 'right';
      if (!side) return;

      setHandPressed(prev => ({ ...prev, [side]: true }));
      setTimeout(() => setHandPressed(prev => ({ ...prev, [side]: false })), 100);

      setNotes(prev => {
        let hit = false;
        const remaining = prev.filter(note => {
          const inZone = note.side === side && note.y + noteSize >= hitZoneTop && note.y <= hitZoneTop + hitZoneSize;
          if (inZone) hit = true;
          return !inZone;
        });

        if (hit) {
          bongoSound.currentTime = 0, bongoSound.play();
          const points = 1 * multiplier;
          const newCombo = combo + 1;

          setScore(prevScore => {
            const newScore = prevScore + points;
            setHighScore(prevHigh => Math.max(prevHigh, newScore)); // updates highScore immediately
            return newScore;
          });

          setCombo(newCombo);

          let newMultiplier = 1;
          if (newCombo >= 101) newMultiplier = 10;
          else if (newCombo >= 51) newMultiplier = 5;
          else if (newCombo >= 26) newMultiplier = 3;
          else if (newCombo >= 11) newMultiplier = 2;
          setMultiplier(newMultiplier);

          let newDisplayMultiplier = 1;
          if (newCombo >= 10 && newCombo < 25) newDisplayMultiplier = 2;
          else if (newCombo >= 25 && newCombo < 50) newDisplayMultiplier = 3;
          else if (newCombo >= 50 && newCombo < 100) newDisplayMultiplier = 5;
          else if (newCombo >= 100) newDisplayMultiplier = 10;
          setDisplayMultiplier(newDisplayMultiplier);
        } else {
          setCombo(0);
          setMultiplier(1);
          setDisplayMultiplier(1);
        }

        return remaining;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [score, combo, multiplier, hitZoneTop, running]);

  // Save high score locally for logged-in users
  useEffect(() => {
    if (!loggedInUser || highScore <= 0) return;

    let isMounted = true;

    (async () => {
      try {
        await apiSubmitScore(highScore);
        if (isMounted) window.dispatchEvent(new CustomEvent('leaderboardUpdate'));
      } catch (e) {
        console.error('Failed to submit high score:', e);
      }
    })();

    return () => { isMounted = false; };
  }, [highScore, loggedInUser]);


  const startGame = () => {
    setRunning(true);
    setNotes([]);
    setScore(0);
    setCombo(0);
    setMultiplier(1);
    setDisplayMultiplier(1);
  };

const stopGame = () => {
  setRunning(false);
  setNotes([]);
  setScore(0);
  setCombo(0);
  setMultiplier(1);
  setDisplayMultiplier(1);
};


  return (
    <main>
      {/* Start/Stop buttons */}
      <div style={{ textAlign: 'center', margin: '10px' }}>
        <button onClick={startGame}>Start</button>
        <button onClick={stopGame}>Reset</button>
      </div>

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

        {/* Score, combo, multiplier */}
        <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", color: "white", textAlign: "center", zIndex: 6 }}>
          <div style={{ fontSize: "24px" }}>Score: {score}</div>
          <div style={{ fontSize: "20px" }}>Combo: {combo}</div>
          <div style={{ fontSize: "18px" }}>Multiplier: {displayMultiplier}x</div>
        </div>

        {/* Hit zones */}
        {[leftBongoLeft - hitZoneHorizontalOffset, rightBongoLeft + hitZoneHorizontalOffset].map((bongoLeft, idx) => (
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

      <section id="highscore" style={{ fontSize: "24px", marginTop: "10px", textAlign: "center" }}>
        High Score: {highScore}
      </section>

      <section id="third-party" style={{ marginTop: "10px", textAlign: "center" }}>
        <h2>Tutorial Video with YouTube Data API</h2>
        <details>
          <summary>Show tutorial</summary>
          <TutorialVideo videoId="TiC8pig6PGE" />
        </details>
      </section>
    </main>
  );
}

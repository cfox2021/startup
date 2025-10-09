import React from 'react';
import '../app.css';

export default function Game() {
  return(
  <main>
    <div id="game-outline" style={{ width: "960px", height: "720px", border: "2px solid #baffc9" }}>
      <img src="game_placeholder.png" alt="Image preview of game" width="700"/>
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
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return(
    <div>
        <header>
        <div className="site_name">
            <h1>Rhythm Monkey</h1>
            <a href="https://github.com/cfox2021/startup.git" target="_blank">GitHub</a>
        </div>

            <hr/>

        <div className="login_leaderboard">
            <nav>
            <ul>
                <li><a href="leaderboard.html">Leaderboard</a></li>
            </ul>
            </nav>

            <section id="login">
            <form method="post" action="#">
                <input type="text" placeholder="username" />
                <input type="password" placeholder="password" />
                <button type="submit">Login</button>
            </form>
            </section>
        </div>

        <div className="username">
            <p id="player-username">Welcome, <span>[username]</span></p>
        </div>
        </header>

        <footer>
            <p>&copy; 2025 Rhythm Monkey. All rights reserved.</p>
        </footer>
    </div>
  )
}
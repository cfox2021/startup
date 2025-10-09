import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Game } from './game/game';
import { Leaderboard } from './leaderboard/leaderboard';

export default function App() {
  return(
    <BrowserRouter>
        <div>
            <header>
            <div className="site_name">
                <h1>Rhythm Monkey</h1>
                <NavLink to="https://github.com/cfox2021/startup.git" target="_blank">GitHub</NavLink>
            </div>

                <hr/>

            <div className="login_leaderboard">
                <nav>
                <ul>
                    <li><NavLink to="leaderboard">Leaderboard</NavLink></li>
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

        <Routes>
        <Route path='/' element={<Game />} exact />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='*' element={<NotFound />} />
        </Routes>

            <footer>
                <p>&copy; 2025 Rhythm Monkey. All rights reserved.</p>
            </footer>
        </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}
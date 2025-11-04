import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Game from './game/game';
import Leaderboard from './leaderboard/leaderboard';
import { apiLogin, apiRegister, apiLogout } from './api';

function Header({ loggedInUser, setLoggedInUser }) {
  const location = useLocation();
  const isOnLeaderboard = location.pathname === '/leaderboard';

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput.trim() !== '') {
      setLoggedInUser(usernameInput); // mock login
      setUsernameInput('');
      setPasswordInput('');
    }

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    try {
      const res = await apiLogin(usernameInput, passwordInput);
      if (res.username) {
        setLoggedInUser(res.username);
        setUsernameInput('');
        setPasswordInput('');
        setError('');
      } else {
        setError(res.msg || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    try {
      const res = await apiRegister(usernameInput, passwordInput);
      if (res.username) {
        // optionally auto-login after register
        await apiLogin(usernameInput, passwordInput);
        setLoggedInUser(usernameInput);
        setUsernameInput('');
        setPasswordInput('');
        setError('');
      } else {
        setError(res.msg || 'Register failed');
      }
    } catch (err) {
      setError('Register failed');
    }
  };

  const handleLogout = async () => {
    await apiLogout();
    setLoggedInUser('');
  };

  };

  return (
    <header>
      <div className="site_name">
        <h1>Rhythm Monkey</h1>
        <NavLink to="https://github.com/cfox2021/startup.git" target="_blank">GitHub</NavLink>
      </div>

      <hr />

      <div className="login_leaderboard">
        <nav>
          <ul>
            <li>
              {isOnLeaderboard ? (
                <NavLink to="/">Game</NavLink>
              ) : (
                <NavLink to="/leaderboard">Leaderboard</NavLink>
              )}
            </li>
          </ul>
        </nav>

        <section id="login">
          {!loggedInUser ? (
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="username" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} required />
              <input type="password" placeholder="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required />
              <button type="submit">Login</button>
              <button type="button" onClick={handleRegister}>Create Account</button>
              {error && <div style={{color:'red'}}>{error}</div>}
            </form>
          ) : (
            <>
              <p>Logged in as: <strong>{loggedInUser}</strong></p>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </section>
      </div>

      <div className="username">
        <p id="player-username">
          Welcome, <span>{loggedInUser || '[username]'}</span>
        </p>
      </div>
    </header>
  );
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState('');

  return (
    <BrowserRouter>
      <div>
        <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

        <Routes>
          <Route path='/' element={<Game loggedInUser={loggedInUser} />} exact />
          <Route path='/leaderboard' element={<Leaderboard loggedInUser={loggedInUser} />} />
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

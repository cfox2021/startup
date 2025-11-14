export async function apiRegister(username, password) {
  const r = await fetch('/api/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return r.json();
}

export async function apiLogin(username, password) {
  const r = await fetch('/api/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return r.json();
}

export async function apiLogout() {
  await fetch('/api/logout', { method: 'POST' });
}

export async function apiGetLeaderboard() {
  const r = await fetch('/api/leaderboard');
  return r.json();
}

export async function apiSubmitScore(score) {
  const r = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ← required for auth cookie
    body: JSON.stringify({ score })
  });
  return r.json();
}

export async function apiGetYouTubeVideo(videoId) {
  const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
  if (!r.ok) throw new Error('Failed to load video data');
  return r.json();
}

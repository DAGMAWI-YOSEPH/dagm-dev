export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GitHub token not configured' });

  const { type } = req.query;
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  };

  try {
    if (type === 'repos') {
      const r = await fetch('https://api.github.com/user/repos?sort=updated&per_page=5', { headers });
      const data = await r.json();
      return res.status(r.ok ? 200 : r.status).json(data);
    }

    if (type === 'commits') {
      const { repo } = req.query;
      if (!repo) return res.status(400).json({ error: 'Missing repo param' });
      const r = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=3`, { headers });
      const data = await r.json();
      return res.status(r.ok ? 200 : r.status).json(data);
    }

    return res.status(400).json({ error: 'Invalid type' });
  } catch {
    return res.status(500).json({ error: 'GitHub API request failed' });
  }
}

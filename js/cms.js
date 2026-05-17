const CMS = (() => {
  const REPO_OWNER = 'DAGMAWI-YOSEPH';
  const REPO_NAME = 'dagm-dev';
  const FILE_PATH = 'content.json';
  const ALLOWED_USER = 'DAGMAWI-YOSEPH';

  let token = null;
  let fileSha = null;
  let contentData = null;

  async function fetchContent() {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`
      );
      if (!res.ok) throw new Error('Failed to fetch content');
      const json = await res.json();
      fileSha = json.sha;
      contentData = JSON.parse(atob(json.content));
      return contentData;
    } catch (err) {
      console.error('CMS fetch error, loading local fallback:', err);
      const res = await fetch('/content.json');
      contentData = await res.json();
      return contentData;
    }
  }

  function getContent() {
    return contentData;
  }

  // --- OAuth ---

  function startOAuth() {
    const clientId = window.__GITHUB_CLIENT_ID__;
    if (!clientId) {
      alert('GitHub Client ID not configured.');
      return;
    }
    const redirect = `${window.location.origin}/api/auth`;
    const scope = 'repo';
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=${scope}`;
    window.location.href = url;
  }

  async function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      token = t;
      sessionStorage.setItem('gh_token', t);
      window.history.replaceState({}, '', '/#admin');
      return true;
    }

    const stored = sessionStorage.getItem('gh_token');
    if (stored) {
      token = stored;
      return true;
    }
    return false;
  }

  async function verifyUser() {
    if (!token) return false;
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return false;
      const user = await res.json();
      return user.login === ALLOWED_USER ? user : false;
    } catch {
      return false;
    }
  }

  function logout() {
    token = null;
    sessionStorage.removeItem('gh_token');
    window.location.hash = '#';
  }

  // --- Save ---

  async function saveContent(data) {
    if (!token) throw new Error('Not authenticated');

    if (!fileSha) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const json = await res.json();
          fileSha = json.sha;
        }
      } catch { /* first commit */ }
    }

    const body = {
      message: `Update content — ${new Date().toLocaleDateString()}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
      sha: fileSha
    };

    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Save failed');
    }

    const result = await res.json();
    fileSha = result.content.sha;
    contentData = data;
    return result;
  }

  // --- Dashboard UI ---

  function populateEditor(data) {
    const fields = ['name', 'fullName', 'location', 'tagline', 'bio', 'status', 'specialization', 'email'];
    fields.forEach(f => {
      const el = document.getElementById(`edit-${f}`);
      if (el) el.value = data.meta[f] || '';
    });

    const tw = document.getElementById('edit-typing_words');
    if (tw) tw.value = (data.meta.typing_words || []).join(', ');

    ['github', 'spotify', 'email'].forEach(s => {
      const el = document.getElementById(`edit-social-${s}`);
      if (el) el.value = data.socials[s] || '';
    });

    renderProjectEditor(data.projects);
    renderSkillsEditor(data.skills);
  }

  function renderProjectEditor(projects) {
    const container = document.getElementById('edit-projects');
    container.innerHTML = '';
    projects.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'project-edit-row';
      row.innerHTML = `
        <input type="text" value="${p.title}" data-field="title" placeholder="Title">
        <input type="url" value="${p.url}" data-field="url" placeholder="URL">
        <input type="text" value="${p.status}" data-field="status" placeholder="Status" style="max-width:100px">
        <button class="btn-icon" data-remove="${i}">&times;</button>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.remove);
        projects.splice(idx, 1);
        renderProjectEditor(projects);
      });
    });
  }

  function renderSkillsEditor(skills) {
    const container = document.getElementById('edit-skills');
    container.innerHTML = '';
    skills.forEach((group) => {
      const div = document.createElement('div');
      div.style.marginBottom = '12px';
      div.innerHTML = `
        <label style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">${group.category}</label>
        <input type="text" value="${group.items.join(', ')}" data-category="${group.category}" style="width:100%;padding:8px 12px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:4px;color:var(--text);font-size:0.8rem;margin-top:6px;outline:none">
      `;
      container.appendChild(div);
    });
  }

  function collectEditorData() {
    const data = JSON.parse(JSON.stringify(contentData));

    const fields = ['name', 'fullName', 'location', 'tagline', 'bio', 'status', 'specialization', 'email'];
    fields.forEach(f => {
      const el = document.getElementById(`edit-${f}`);
      if (el) data.meta[f] = el.value;
    });

    const tw = document.getElementById('edit-typing_words');
    if (tw) data.meta.typing_words = tw.value.split(',').map(s => s.trim()).filter(Boolean);

    ['github', 'spotify', 'email'].forEach(s => {
      const el = document.getElementById(`edit-social-${s}`);
      if (el) data.socials[s] = el.value;
    });

    const projectRows = document.querySelectorAll('#edit-projects .project-edit-row');
    data.projects = Array.from(projectRows).map((row, i) => {
      const title = row.querySelector('[data-field="title"]').value;
      const url = row.querySelector('[data-field="url"]').value;
      const status = row.querySelector('[data-field="status"]').value;
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { id, title, url, status };
    });

    const skillInputs = document.querySelectorAll('#edit-skills input[data-category]');
    data.skills = Array.from(skillInputs).map(input => ({
      category: input.dataset.category,
      items: input.value.split(',').map(s => s.trim()).filter(Boolean)
    }));

    return data;
  }

  function initDashboard() {
    const loginBtn = document.getElementById('admin-github-login');
    const saveBtn = document.getElementById('admin-save');
    const logoutBtn = document.getElementById('admin-logout');
    const addProjectBtn = document.getElementById('add-project');
    const statusEl = document.getElementById('save-status');

    if (loginBtn) loginBtn.addEventListener('click', startOAuth);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', () => {
        const data = collectEditorData();
        data.projects.push({ id: '', title: '', url: '', status: new Date().getFullYear().toString() });
        renderProjectEditor(data.projects);
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        statusEl.textContent = 'Saving...';
        try {
          const data = collectEditorData();
          await saveContent(data);
          statusEl.textContent = 'Committed & pushed successfully.';
          setTimeout(() => { statusEl.textContent = ''; }, 3000);
        } catch (err) {
          statusEl.textContent = 'Error: ' + err.message;
        }
      });
    }
  }

  async function showDashboard() {
    const hasAuth = await handleCallback();
    if (hasAuth) {
      const user = await verifyUser();
      if (user) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-editor').style.display = 'block';
        document.getElementById('admin-user').textContent = `@${user.login}`;
        await fetchContent();
        populateEditor(contentData);
        return;
      }
    }
    document.getElementById('admin-login').style.display = 'flex';
    document.getElementById('admin-editor').style.display = 'none';
  }

  return {
    fetchContent,
    getContent,
    handleCallback,
    showDashboard,
    initDashboard,
    logout
  };
})();

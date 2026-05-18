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
    const fields = ['name', 'fullName', 'location', 'tagline', 'status', 'specialization', 'email'];
    fields.forEach(f => {
      const el = document.getElementById(`edit-${f}`);
      if (el) el.value = data.meta[f] || '';
    });

    const bioEl = document.getElementById('edit-bio');
    if (bioEl) bioEl.value = data.meta.aboutBio || '';

    const tw = document.getElementById('edit-typing_words');
    if (tw) tw.value = (data.meta.typing_words || []).join(', ');

    ['github', 'spotify', 'letterboxd', 'upwork', 'email'].forEach(s => {
      const el = document.getElementById(`edit-social-${s}`);
      if (el) el.value = data.socials[s] || '';
    });

    renderProjectEditor(data.projects);
    renderSkillsEditor(data.skills);
    renderIdeasAdmin(data.ideas || []);
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

    const fields = ['name', 'fullName', 'location', 'tagline', 'status', 'specialization', 'email'];
    fields.forEach(f => {
      const el = document.getElementById(`edit-${f}`);
      if (el) data.meta[f] = el.value;
    });

    const bioEl = document.getElementById('edit-bio');
    if (bioEl) data.meta.aboutBio = bioEl.value;

    const tw = document.getElementById('edit-typing_words');
    if (tw) data.meta.typing_words = tw.value.split(',').map(s => s.trim()).filter(Boolean);

    ['github', 'spotify', 'letterboxd', 'upwork', 'email'].forEach(s => {
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

    data.ideas = contentData.ideas || [];

    return data;
  }

  // --- Ideas CMS ---

  let editingIdeaIndex = -1;

  function renderIdeasAdmin(ideas) {
    const container = document.getElementById('ideas-admin-list');
    if (!container) return;
    container.innerHTML = '';
    (ideas || []).forEach((idea, i) => {
      const row = document.createElement('div');
      row.className = 'idea-admin-row';
      row.innerHTML = `
        <span class="idea-admin-title">${idea.title || 'Untitled'}</span>
        <span class="idea-status-badge ${idea.status}">${idea.status}</span>
        <span class="idea-admin-date">${idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'New'}</span>
        <button class="btn btn-ghost btn-sm" data-edit-idea="${i}">Edit</button>
      `;
      container.appendChild(row);
    });
    container.querySelectorAll('[data-edit-idea]').forEach(btn => {
      btn.addEventListener('click', () => openIdeaEditor(parseInt(btn.dataset.editIdea)));
    });
  }

  function openIdeaEditor(index) {
    editingIdeaIndex = index;
    const ideas = contentData.ideas || [];
    const idea = ideas[index] || {};

    document.getElementById('ideas-manager').style.display = 'none';
    document.getElementById('ideas-editor').style.display = '';

    document.getElementById('edit-idea-title').value = idea.title || '';
    document.getElementById('edit-idea-status').value = idea.status || 'draft';
    document.getElementById('edit-idea-excerpt').value = idea.excerpt || '';
    document.getElementById('idea-body-editor').innerHTML = idea.body || '';

    const coverPreview = document.getElementById('idea-cover-preview');
    const coverRemove = document.getElementById('idea-cover-remove');
    if (idea.coverImage) {
      coverPreview.innerHTML = `<img src="${idea.coverImage}" alt="Cover">`;
      coverRemove.style.display = '';
    } else {
      coverPreview.innerHTML = '';
      coverRemove.style.display = 'none';
    }
  }

  function closeIdeaEditor() {
    document.getElementById('ideas-manager').style.display = '';
    document.getElementById('ideas-editor').style.display = 'none';
    editingIdeaIndex = -1;
  }

  function collectIdeaFromEditor() {
    const title = document.getElementById('edit-idea-title').value.trim();
    const status = document.getElementById('edit-idea-status').value;
    const body = document.getElementById('idea-body-editor').innerHTML;
    let excerpt = document.getElementById('edit-idea-excerpt').value.trim();

    if (!excerpt) {
      const tmp = document.createElement('div');
      tmp.innerHTML = body;
      excerpt = (tmp.textContent || '').substring(0, 140).trim();
      if ((tmp.textContent || '').length > 140) excerpt += '...';
    }

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const existing = (contentData.ideas || [])[editingIdeaIndex];
    const coverPreviewImg = document.querySelector('#idea-cover-preview img');

    return {
      id: id || (existing && existing.id) || Date.now().toString(),
      title,
      body,
      excerpt,
      coverImage: coverPreviewImg ? coverPreviewImg.src : '',
      status,
      createdAt: (existing && existing.createdAt) || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function saveIdeaToData() {
    if (editingIdeaIndex < 0) return;
    if (!contentData.ideas) contentData.ideas = [];
    const idea = collectIdeaFromEditor();
    contentData.ideas[editingIdeaIndex] = idea;
    renderIdeasAdmin(contentData.ideas);
  }

  async function resizeImage(file, maxWidth) {
    maxWidth = maxWidth || 1200;
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(resolve, 'image/jpeg', 0.85);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function uploadIdeaImage(file) {
    const resized = await resizeImage(file);
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '');
        const path = `img/ideas/${filename}`;

        try {
          const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: `Add idea image: ${filename}`,
                content: base64
              })
            }
          );
          if (!res.ok) throw new Error('Upload failed');
          resolve('/' + path);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsDataURL(resized);
    });
  }

  function initIdeaToolbar() {
    const toolbar = document.getElementById('idea-toolbar');
    if (!toolbar) return;

    toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        const val = btn.dataset.val || null;
        document.execCommand(cmd, false, val ? `<${val}>` : null);
        document.getElementById('idea-body-editor').focus();
      });
    });

    const bodyImageInput = document.getElementById('idea-body-image');
    if (bodyImageInput) {
      bodyImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const statusEl = document.getElementById('save-status');
        statusEl.textContent = 'Uploading image...';
        try {
          const path = await uploadIdeaImage(file);
          document.getElementById('idea-body-editor').focus();
          document.execCommand('insertHTML', false, `<img src="${path}" alt="${file.name}">`);
          statusEl.textContent = 'Image uploaded.';
          setTimeout(() => { statusEl.textContent = ''; }, 2000);
        } catch (err) {
          statusEl.textContent = 'Image upload failed: ' + err.message;
        }
        bodyImageInput.value = '';
      });
    }

    const coverInput = document.getElementById('idea-cover-file');
    if (coverInput) {
      coverInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const statusEl = document.getElementById('save-status');
        statusEl.textContent = 'Uploading cover...';
        try {
          const path = await uploadIdeaImage(file);
          document.getElementById('idea-cover-preview').innerHTML = `<img src="${path}" alt="Cover">`;
          document.getElementById('idea-cover-remove').style.display = '';
          statusEl.textContent = 'Cover uploaded.';
          setTimeout(() => { statusEl.textContent = ''; }, 2000);
        } catch (err) {
          statusEl.textContent = 'Cover upload failed: ' + err.message;
        }
        coverInput.value = '';
      });
    }

    const coverRemove = document.getElementById('idea-cover-remove');
    if (coverRemove) {
      coverRemove.addEventListener('click', () => {
        document.getElementById('idea-cover-preview').innerHTML = '';
        coverRemove.style.display = 'none';
      });
    }

    // Paste sanitizer
    const editor = document.getElementById('idea-body-editor');
    if (editor) {
      editor.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/html') ||
                     (e.clipboardData || window.clipboardData).getData('text/plain');
        const clean = document.createElement('div');
        clean.innerHTML = text;
        // Strip unwanted tags but keep basic formatting
        clean.querySelectorAll('script,style,meta,link').forEach(el => el.remove());
        document.execCommand('insertHTML', false, clean.innerHTML);
      });
    }
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

    // Ideas
    const addIdeaBtn = document.getElementById('add-idea');
    const ideasEditorBack = document.getElementById('ideas-editor-back');
    const ideaDeleteBtn = document.getElementById('idea-delete');

    if (addIdeaBtn) {
      addIdeaBtn.addEventListener('click', () => {
        if (!contentData.ideas) contentData.ideas = [];
        contentData.ideas.push({
          id: '', title: '', body: '', excerpt: '', coverImage: '',
          status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        });
        renderIdeasAdmin(contentData.ideas);
        openIdeaEditor(contentData.ideas.length - 1);
      });
    }

    if (ideasEditorBack) {
      ideasEditorBack.addEventListener('click', () => {
        saveIdeaToData();
        closeIdeaEditor();
      });
    }

    if (ideaDeleteBtn) {
      ideaDeleteBtn.addEventListener('click', () => {
        if (editingIdeaIndex >= 0 && confirm('Delete this post?')) {
          contentData.ideas.splice(editingIdeaIndex, 1);
          renderIdeasAdmin(contentData.ideas);
          closeIdeaEditor();
        }
      });
    }

    initIdeaToolbar();

    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        // Save current idea editor if open
        if (editingIdeaIndex >= 0) saveIdeaToData();

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

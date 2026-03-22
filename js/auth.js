
 /* Role selection */
  let selectedRole = 'reader';
  function selectRole(role) {
    selectedRole = role;
    document.getElementById('role-reader').classList.toggle('active', role === 'reader');
    document.getElementById('role-writer').classList.toggle('active', role === 'writer');
    document.getElementById('su-role-err').classList.remove('visible');
  }

  /* Tab switching */
  function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.form-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + tab).classList.add('active');
  }

  /* Password visibility toggle */
  function togglePw(id, btn) {
    const inp = document.getElementById(id);
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.innerHTML = isText
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  }

  /* Password strength */
  function checkStrength(val) {
    const wrap = document.getElementById('strength-wrap');
    const bars = [document.getElementById('sb1'),document.getElementById('sb2'),document.getElementById('sb3'),document.getElementById('sb4')];
    const label = document.getElementById('strength-label');
    if (!val) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'block';

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const cls = ['', 'lit-weak', 'lit-mid', 'lit-mid', 'lit-strong'];
    const lbls = ['','Weak','Fair','Good','Strong'];
    bars.forEach((b, i) => { b.className = 'strength-bar' + (i < score ? ' ' + cls[score] : ''); });
    label.textContent = lbls[score] || '';
  }

  /* Validation helpers */
  function showErr(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.add('visible');
    document.getElementById(id.replace('-err','').replace(/-\w+$/,'')); // noop
  }
  function clearErr(id) { document.getElementById(id)?.classList.remove('visible'); }

  function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  /* Login submit */
  function handleLogin() {
    let ok = true;
    const email = document.getElementById('login-email').value.trim();
    const pw = document.getElementById('login-pw').value;

    clearErr('login-email-err'); clearErr('login-pw-err');
    document.getElementById('login-email').classList.remove('error');
    document.getElementById('login-pw').classList.remove('error');

    if (!validateEmail(email)) {
      document.getElementById('login-email').classList.add('error');
      document.getElementById('login-email-err').classList.add('visible');
      ok = false;
    }
    if (!pw) {
      document.getElementById('login-pw').classList.add('error');
      document.getElementById('login-pw-err').classList.add('visible');
      ok = false;
    }
    if (ok) {
      document.getElementById('login-success').classList.add('visible');
    }
  }

  /* Signup submit */
  function handleSignup() {
    let ok = true;
    const first = document.getElementById('su-first').value.trim();
    const last  = document.getElementById('su-last').value.trim();
    const email = document.getElementById('su-email').value.trim();
    const pw    = document.getElementById('su-pw').value;
    const terms = document.getElementById('agree-terms').checked;

    ['su-first-err','su-last-err','su-email-err','su-pw-err','su-terms-err','su-role-err'].forEach(clearErr);
    ['su-first','su-last','su-email','su-pw'].forEach(id => document.getElementById(id).classList.remove('error'));

    if (!first) { document.getElementById('su-first').classList.add('error'); document.getElementById('su-first-err').classList.add('visible'); ok = false; }
    if (!last)  { document.getElementById('su-last').classList.add('error');  document.getElementById('su-last-err').classList.add('visible');  ok = false; }
    if (!validateEmail(email)) { document.getElementById('su-email').classList.add('error'); document.getElementById('su-email-err').classList.add('visible'); ok = false; }
    if (pw.length < 8) { document.getElementById('su-pw').classList.add('error'); document.getElementById('su-pw-err').classList.add('visible'); ok = false; }
    if (!terms) { document.getElementById('su-terms-err').classList.add('visible'); ok = false; }

    if (ok) {
      document.getElementById('signup-success').classList.add('visible');
    }
  }
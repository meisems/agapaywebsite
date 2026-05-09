/**
 * Agapay Clinical Laboratory — main.js
 * ─────────────────────────────────────────
 * Contents:
 *  1. Inquiry Form (handleSubmit, showFormError, resetForm)
 *  2. Inbox Panel  (openInbox, closeInboxPanel, renderInbox, clearInbox, updateBadge)
 *  3. Mobile Navigation (toggleMenu)
 *  4. Test Menu Tabs (switchTab)
 *  5. Scroll Reveal (IntersectionObserver)
 *  6. Scroll-to-Top button visibility
 */

/* ── INQUIRY FORM LOGIC ── */
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('inquiryForm');
  const inputs = form.querySelectorAll('input, select, textarea');
  const firstName = form.querySelector('input[placeholder="Juan"]').value.trim();
  const lastName  = form.querySelector('input[placeholder="Dela Cruz"]').value.trim();
  const email     = form.querySelector('input[type="email"]').value.trim();
  const phone     = form.querySelector('input[type="tel"]').value.trim();
  const test      = form.querySelector('select').value;
  const message   = form.querySelector('textarea').value.trim();

  if (!firstName || !lastName || !email || !test) {
    showFormError('Please fill in all required fields (Name, Email, and Test).'); return;
  }

  const inquiry = {
    id: Date.now(),
    firstName, lastName, email, phone, test, message,
    submittedAt: new Date().toLocaleString('en-PH', {dateStyle:'medium', timeStyle:'short'})
  };

  const all = JSON.parse(localStorage.getItem('agapay_inquiries') || '[]');
  all.unshift(inquiry);
  localStorage.setItem('agapay_inquiries', JSON.stringify(all));

  form.style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
  updateBadge();
}

function showFormError(msg) {
  let el = document.getElementById('form-error');
  if (!el) {
    el = document.createElement('p');
    el.id = 'form-error';
    el.style.cssText = 'color:#c0392b;font-size:.82rem;margin-top:-.4rem;padding:.6rem .9rem;background:#fff0f0;border-radius:6px;border-left:3px solid #c0392b;';
    document.getElementById('inquiryForm').prepend(el);
  }
  el.textContent = msg;
  setTimeout(() => el && (el.textContent = ''), 4000);
}

function resetForm() {
  const form = document.getElementById('inquiryForm');
  form.reset();
  form.style.display = 'flex';
  document.getElementById('form-success').style.display = 'none';
}

/* ── INBOX PANEL ── */
function openInbox() {
  renderInbox();
  document.getElementById('inbox-overlay').style.display = 'block';
  const panel = document.getElementById('inbox-panel');
  panel.style.display = 'flex';
  requestAnimationFrame(() => panel.style.transform = 'translateX(0)');
}

function closeInboxPanel() {
  document.getElementById('inbox-overlay').style.display = 'none';
  document.getElementById('inbox-panel').style.display = 'none';
}

function closeInbox(e) {
  if (e.target === document.getElementById('inbox-overlay')) closeInboxPanel();
}

function renderInbox() {
  const all = JSON.parse(localStorage.getItem('agapay_inquiries') || '[]');
  const body = document.getElementById('inbox-body');
  if (all.length === 0) {
    body.innerHTML = `<div class="inbox-empty"><div>📋</div><p>No inquiries submitted yet.<br>Fill out the contact form to see them here.</p></div>`;
    return;
  }
  body.innerHTML = `<p style="font-family:'DM Mono',monospace;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3);margin-bottom:1rem;">${all.length} Inquiry${all.length>1?'s':''} Received</p>` +
  all.map((q, i) => `
    <div class="inbox-card">
      <div class="inbox-card-hdr">
        <span class="inbox-name">${q.firstName} ${q.lastName}</span>
        <span class="inbox-time">${q.submittedAt}</span>
      </div>
      <span class="inbox-test">&#10003; ${q.test}</span>
      <div class="inbox-meta">
        <span>📧 ${q.email}</span>
        ${q.phone ? `<span>📞 ${q.phone}</span>` : ''}
      </div>
      ${q.message ? `<div class="inbox-msg">“${q.message}”</div>` : ''}
    </div>
  `).join('');
}

function clearInbox() {
  if (!confirm('Clear all submitted inquiries? This cannot be undone.')) return;
  localStorage.removeItem('agapay_inquiries');
  renderInbox();
  updateBadge();
}

function updateBadge() {
  const all = JSON.parse(localStorage.getItem('agapay_inquiries') || '[]');
  const badge = document.getElementById('inbox-fab-badge');
  const fab   = document.getElementById('inbox-fab');
  if (all.length > 0) {
    badge.textContent = all.length;
    badge.style.display = 'inline-flex';
    fab.style.display = 'flex';
  } else {
    fab.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', updateBadge);

function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  m.style.display=m.style.display==='flex'?'none':'flex';
}
// Close menu when a link is clicked
document.addEventListener('click',function(e){
  if(e.target.closest('#mobileMenu a')){
    document.getElementById('mobileMenu').style.display='none';
  }
});

function switchTab(btn, id) {
  document.querySelectorAll('.t-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.t-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

(function(){
  var btn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', function(){
    if (window.scrollY > 400) { btn.classList.add('visible'); }
    else { btn.classList.remove('visible'); }
  }, { passive: true });
})();
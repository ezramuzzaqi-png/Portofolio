// Huruf tempelan ala "ransom note": pecah teks ber-atribut data-ransom jadi huruf-huruf
document.querySelectorAll('[data-ransom]').forEach(el => {
  const teks = el.dataset.ransom;
  const host = el.closest('a,h1,h2,h3');
  if (host) host.setAttribute('aria-label', teks);
  el.textContent = '';
  [...teks].forEach((c, i) => {
    const s = document.createElement('span');
    s.textContent = c === ' ' ? '\u00a0' : (i % 3 === 2 ? c.toLowerCase() : c.toUpperCase());
    s.setAttribute('aria-hidden', 'true');
    s.style.animationDelay = i * 50 + 'ms';
    if (c === ' ') s.className = 'gap';
    el.appendChild(s);
  });
});

// Daftar menu: yang disorot jadi merah dan teks petunjuk ikut berganti, seperti di game
document.querySelectorAll('.menu').forEach(m => {
  const ls = [...m.querySelectorAll('a')];
  const host = m.closest('header,section');
  const info = host && host.querySelector('.hint,.note');
  const pilih = a => {
    ls.forEach(l => l.classList.toggle('on', l === a));
    if (info && a.dataset.hint) info.textContent = a.dataset.hint;
  };
  ls.forEach(a => ['mouseenter', 'focus'].forEach(e => a.addEventListener(e, () => pilih(a))));
  if (ls.length) pilih(ls[0]);
});

// Halaman proyek: sorot satu proyek untuk melihat detailnya
const proyek = [...document.querySelectorAll('.plist li')];
proyek.forEach(li => {
  const tampil = () => proyek.forEach(x => x.classList.toggle('on', x === li));
  const row = li.querySelector('.row');
  if (row) ['mouseenter', 'focus', 'click'].forEach(e => row.addEventListener(e, tampil));
});

// Transisi pindah halaman: tutup dengan "slash", lalu buka halaman tujuan
const wipe = document.querySelector('.wipe') || document.createElement('div');
const kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('click', e => {
  const a = e.target.closest('a[href$=".html"]');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey || a.target === '_blank') return;
  e.preventDefault();
  if (kurangGerak) { location.href = a.href; return; }
  if (wipe.classList.contains('out')) return;
  wipe.classList.add('out');
  setTimeout(() => { location.href = a.href; }, 600);
});
// Kembali lewat tombol back browser: buka lagi transisinya
window.addEventListener('pageshow', e => { if (e.persisted) wipe.classList.remove('out'); });
// Animasi halaman dimulai setelah transisi membuka layar
setTimeout(() => document.documentElement.classList.add('ready'), 300);

// Keyboard: panah atas/bawah memilih, Esc atau B kembali (seperti tombol B di game)
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Escape' || (e.key || '').toLowerCase() === 'b') {
    const kembali = document.querySelector('.back');
    if (kembali) kembali.click();
    return;
  }
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
  const item = [...document.querySelectorAll('.menu a,.row')];
  if (!item.length) return;
  e.preventDefault();
  let i = item.indexOf(document.activeElement);
  if (i < 0) i = item.findIndex(x => x.classList.contains('on') || x.closest('li.on'));
  item[(i + (e.key === 'ArrowDown' ? 1 : -1) + item.length) % item.length].focus();
});
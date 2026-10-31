/* about.js - merender halaman Tentang (id + en). Teks ada di objek T di bawah, edit di situ. */
(function () {
  'use strict';
  var KEY = 'SOILS_SETTINGS_PREFS_V1';
  var T = {
    id: {
      kicker: 'Tentang',
      lead: 'Workspace praktikum dan olah data Ilmu Tanah. Gratis dan bisa dipakai offline.',
      ver: 'Versi 11', edition: 'Earthy Soil Edition',
      stats: [['127', 'Kalkulator'], ['8', 'Kategori'], ['Gratis', 'Bisa dipakai offline']],
      aboutTitle: 'Untuk mahasiswa Ilmu Tanah',
      aboutText: 'Olah data mentah, hitung otomatis, dan baca hasil sesuai baku mutu dalam satu tempat.',
      featLabel: 'Fitur utama',
      feats: [
        ['calc', 'Hitung presisi', '127 kalkulator ilmu tanah, dari kimia sampai statistik.'],
        ['steps', 'Cara kerja', 'Rumus dan langkah substitusi yang transparan.'],
        ['table', 'Multi-sampel', 'Hitung batch dari tabel, impor langsung dari Excel.'],
        ['palette', 'Morfologi', 'Pencocokan warna Munsell interaktif.']
      ],
      devLabel: 'Pengembang',
      role: 'Mahasiswa Ilmu Tanah & Developer', univ: 'Universitas Riau',
      foot: 'Dikembangkan oleh Kheysyah Putra Mefan, Universitas Riau'
    },
    en: {
      kicker: 'About',
      lead: 'A workspace for soil science practicums and data. Free, and works offline.',
      ver: 'Version 11', edition: 'Earthy Soil Edition',
      stats: [['127', 'Calculators'], ['8', 'Categories'], ['Free', 'Works offline']],
      aboutTitle: 'Built for soil science students',
      aboutText: 'Process raw data, calculate automatically, and read results against quality standards in one place.',
      featLabel: 'Key features',
      feats: [
        ['calc', 'Precise calculations', '127 soil science calculators, from chemistry to statistics.'],
        ['steps', 'How it works', 'Transparent formulas and substitution steps.'],
        ['table', 'Multi-sample', 'Batch calculate from a table, import straight from Excel.'],
        ['palette', 'Morphology', 'Interactive Munsell color matching.']
      ],
      devLabel: 'Developer',
      role: 'Soil Science Student & Developer', univ: 'Universitas Riau',
      foot: 'Developed by Kheysyah Putra Mefan, Universitas Riau'
    }
  };
  var SVG = function (inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  };
  var IC = {
    logo: SVG('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>'),
    calc: SVG('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>'),
    steps: SVG('<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/>'),
    table: SVG('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
    palette: SVG('<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>'),
    github: SVG('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>'),
    chat: SVG('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),
    go: SVG('<path d="M7 7h10v10"/><path d="M7 17 17 7"/>')
  };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lang() {
    try { return (JSON.parse(localStorage.getItem(KEY) || '{}')).lang === 'en' ? 'en' : 'id'; } catch (e) { return 'id'; }
  }
  function html(L) {
    var feats = L.feats.map(function (f) {
      return '<div class="ab-feat"><span class="ab-ico">' + IC[f[0]] + '</span><div><strong>' + esc(f[1]) + '</strong><span class="ab-fd">' + esc(f[2]) + '</span></div></div>';
    }).join('');
    var stats = L.stats.map(function (s) { return '<div class="ab-stat"><strong>' + esc(s[0]) + '</strong><span>' + esc(s[1]) + '</span></div>'; }).join('');
    return '<div class="ab">' +
      '<header class="ab-hero"><div class="ab-hero-main">' +
        '<span class="ab-kicker">' + esc(L.kicker) + '</span><h1>SOILS Calculator PRO</h1><p class="ab-lead">' + esc(L.lead) + '</p>' +
        '<div class="ab-pills"><span class="ab-pill is-accent">' + esc(L.ver) + '</span><span class="ab-pill">' + esc(L.edition) + '</span></div>' +
      '</div><div class="ab-hero-mark">' + IC.logo + '</div></header>' +
      '<div class="ab-stats">' + stats + '</div>' +
      '<div class="ab-grid">' +
        '<section class="ab-card"><h2>' + esc(L.aboutTitle) + '</h2><p class="ab-sub">' + esc(L.aboutText) + '</p>' +
          '<p class="ab-label">' + esc(L.featLabel) + '</p><div class="ab-features">' + feats + '</div></section>' +
        '<aside class="ab-card"><p class="ab-label" style="margin-top:0!important">' + esc(L.devLabel) + '</p>' +
          '<div class="ab-dev-top"><div class="ab-avatar" aria-hidden="true">KM</div><div>' +
            '<h2 class="ab-dev-name">Kheysyah Putra Mefan</h2><p class="ab-dev-role">' + esc(L.role) + '</p><p class="ab-dev-univ">' + esc(L.univ) + '</p></div></div>' +
          '<div class="ab-links">' +
            '<a class="ab-link" href="https://github.com/putramefan" target="_blank" rel="noopener noreferrer">' + IC.github + '<span>GitHub</span><span class="ab-go">' + IC.go + '</span></a>' +
            '<a class="ab-link" href="https://wa.link/fihpyl" target="_blank" rel="noopener noreferrer">' + IC.chat + '<span>WhatsApp</span><span class="ab-go">' + IC.go + '</span></a>' +
          '</div></aside>' +
      '</div>' +
      '<footer class="ab-foot">&copy; ' + new Date().getFullYear() + ' SOILS Calculator PRO<br>' + esc(L.foot) + '</footer>' +
    '</div>';
  }
  function render() {
    var host = document.getElementById('soils-page-about');
    if (!host) return false;
    var l = lang();
    if (host.dataset.abLang === l && host.querySelector(':scope > .ab')) return true;
    host.innerHTML = html(T[l]);
    host.dataset.abLang = l;
    return true;
  }
  var mo = null;
  function watch() {
    if (mo) mo.disconnect();
    var host = document.getElementById('soils-page-about');
    if (host) {
      render();
      mo = new MutationObserver(function () { if (!host.querySelector(':scope > .ab')) { mo.disconnect(); render(); mo.observe(host, { childList: true }); } });
      mo.observe(host, { childList: true });
    } else {
      mo = new MutationObserver(function () { if (document.getElementById('soils-page-about')) watch(); });
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  }
  function start() {
    watch();
    document.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('[data-set-lang]')) setTimeout(render, 160);
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
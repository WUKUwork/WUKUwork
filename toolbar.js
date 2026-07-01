(function() {
  // 完整还原后的高清矢量 SVG 导航栏 HTML 结构
  var TOOLBAR_HTML = [
    '<header class="toolbar-header" id="sharedToolbar">',
    '  <div class="toolbar-left-btn" id="menu-btn">',
    '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.07 23.07">',
    '      <g>',
    '        <rect fill="#231815" x="3.37" y="6.82" width="16.33" height="1.55"/>',
    '        <rect fill="#231815" x="3.37" y="14.72" width="16.33" height="1.55"/>',
    '        <rect fill="#231815" x="3.37" y="10.77" width="16.33" height="1.55"/>',
    '      </g>',
    '      <path fill="#231815" d="M23.07,23.07H0V0h23.07v23.07ZM1,22.07h21.07V1H1v21.07Z"/>',
    '    </svg>',
    '  </div>',
    '  <div class="toolbar-center-text" style="cursor: pointer;" onclick="window.location.href=\'index.html\'">',
    '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 117.68 35.86" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">',
    '      <path fill="#231815" d="M2.8,24.23L0,12.14h2.18l1.24,5.91.76,3.71h.05l.87-3.71,1.44-5.91h2.41l1.43,5.91.86,3.71h.05l.78-3.71,1.27-5.91h2.1l-2.9,12.09h-2.49l-1.57-6.43-.76-3.25h-.03l-.79,3.25-1.58,6.43h-2.52Z"/>',
    '      <path fill="#231815" d="M17.23,12.14h2.14v7.44c0,1.95.68,2.92,2.44,2.92s2.46-.97,2.46-2.92v-7.44h2.13v7.14c0,3.55-1.22,5.16-4.59,5.16s-4.59-1.62-4.59-5.16v-7.14s.01,0,.01,0Z"/>',
    '      <path fill="#231815" d="M29.22,24.23v-12.09h2.18v6.02h.08l1.72-2.24,3.1-3.78h2.51l-4.24,5.05,4.57,7.04h-2.59l-3.51-5.53-1.63,1.91v3.61h-2.19Z"/>',
    '      <path fill="#231815" d="M40.77,12.14h2.14v7.44c0,1.95.68,2.92,2.44,2.92s2.46-.97,2.46-2.92v-7.44h2.13v7.14c0,3.55-1.22,5.16-4.59,5.16s-4.59-1.62-4.59-5.16v-7.14h0Z"/>',
    '      <path fill="#231815" d="M54.21,24.23l-2.49-9.02h2.05l.94,3.79.71,3.1h.07l.86-3.1,1.09-3.79h1.91l1.12,3.79.86,3.1h.07l.71-3.1.92-3.79h1.98l-2.47,9.02h-2.29l-1.19-4.06-.69-2.47h-.03l-.66,2.47-1.19,4.06h-2.28Z"/>',
    '      <path fill="#231815" d="M65.95,19.71c0-2.9,1.62-4.72,4.17-4.72s4.17,1.81,4.17,4.72-1.6,4.73-4.17,4.73-4.17-1.85-4.17-4.73ZM72.09,20.54v-1.63c0-1.44-.76-2.21-1.96-2.21s-1.95.78-1.95,2.21v1.63c0,1.44.74,2.19,1.95,2.19s1.96-.76,1.96-2.19Z"/>',
    '      <path fill="#231815" d="M76.31,24.23v-9.02h2.11v1.83h.08c.25-.94.99-1.83,2.42-1.83h.48v2h-.71c-1.48,0-2.28.45-2.28,1.44v5.59h-2.11.01Z"/>',
    '      <path fill="#231815" d="M83.05,24.23v-12.82h2.11v7.8h.08l1.2-1.63,2.13-2.38h2.39l-3.15,3.48,3.45,5.54h-2.52l-2.38-4.11-1.2,1.32v2.79h-2.11Z"/>',
    '      <path fill="#231815" d="M91.81,20.01v-2.09h4.92v2.09h-4.92Z"/>',
    '      <path fill="#231815" d="M102,23.14v-3.35h-3.12v-1.72h3.12v-3.35h1.88v3.35h3.12v1.72h-3.12v3.35h-1.88Z"/>',
    '      <path fill="#231815" d="M117.01,12.14v1.9h-5.43l-.26,4.12h.12c.51-1.02,1.12-1.7,2.56-1.7,2.06,0,3.68,1.42,3.68,3.81s-1.62,4.17-4.42,4.17c-2.23,0-3.38-1.07-4.12-2.23l1.58-1.22c.56.94,1.22,1.67,2.56,1.67s2.13-.84,2.13-2.19v-.17c0-1.3-.76-2.06-2.09-2.06-1.01,0-1.58.46-1.98.92l-1.78-.25.45-6.78h7.03-.03Z"/>',
    '    </svg>',
    '  </div>',
    '  <div class="toolbar-right-btn" id="user-btn">',
    '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.07 23.07">',
    '      <g>',
    '        <path fill="#231815" d="M4.22,15.61V7.48h1.48l2.24,4.18h.04l2.22-4.18h1.46v8.13h-1.2v-6.31h-.04l-.63,1.25-1.85,3.35-1.83-3.34-.64-1.29h-.04v6.33h-1.21Z"/>',
    '        <path fill="#231815" d="M18.86,15.61h-5.16V7.48h5.16v1.11h-3.9v2.35h3.56v1.1h-3.56v2.46h3.9v1.11Z"/>',
    '      </g>',
    '      <path fill="#231815" d="M23.07,23.07H0V0h23.07v23.07h0ZM1,22.07h21.07V1H1v21.07h0Z"/>',
    '    </svg>',
    '  </div>',
    '</header>',
    '<div class="menu-popup" id="menuPopup">',
    '  <a href="' + getRelativePath() + 'index.html" class="menu-home-link">* WUKUwork-+5 *</a>',
    '  <a href="' + getRelativePath() + 'works.html">*1-UnIqUe PrOdUcT</a>',
    '  <a href="' + getRelativePath() + 'visual.html">*2-ViSuAl WoRkS</a>',
    '  <a href="' + getRelativePath() + 'about.html">*3+AbOuT WUKU</a>',
    '  <a href="' + getRelativePath() + 'contact.html">*4+CoNtAcT WUKU</a>',
    '</div>'
  ].join('\n');

  // 工具栏CSS - 锁定中间 Logo 在最高精度的物理尺寸上，绝不随设备大小变化
  var TOOLBAR_CSS = [
    '.toolbar-header {',
    '  position: fixed;',
    '  top: 0; left: 0; right: 0;',
    '  z-index: 1000;',
    '  background: #fff;',
    '  border-top: 1px solid #231815;',
    '  border-bottom: 1px solid #231815;',
    '  padding: 0 20px;',
    '  display: flex;',
    '  justify-content: space-between;',
    '  align-items: center;',
    '  height: 57.86px;    /* 保持：导航栏精致的高度 */',
    '  box-sizing: border-box;',
    '}',
    '.toolbar-left-btn { width: 23.07px; flex-shrink: 0; cursor: pointer; } /* 保持：左侧按钮原版尺寸 */',
    '.toolbar-center-text {',
    '  width: 170px !important;  /* 强行锁死：Logo 物理宽度增加至 170px */',
    '  height: 52px !important;  /* 强行锁死：Logo 物理高度提升至 52px（极限饱满大字，且不溢出破线） */',
    '  flex-shrink: 0;',
    '  cursor: pointer;',
    '}',
    '.toolbar-right-btn { width: 23.07px; flex-shrink: 0; cursor: pointer; } /* 保持：右侧按钮尺寸 */',
    '.toolbar-left-btn svg, .toolbar-center-text svg, .toolbar-right-btn svg {',
    '  width: 100%; height: auto; display: block;',
    '}',
    '.menu-popup {',
    '  position: fixed;',
    '  top: 50%; left: 50%;',
    '  transform: translate(-50%, -50%) scale(0.95);',
    '  background: #fff;',
    '  border: 1.5px solid #000;',
    '  padding: 40px 30px;',
    '  z-index: 5000;',
    '  opacity: 0;',
    '  visibility: hidden;',
    '  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;',
    '  width: 85vw;',
    '  max-width: 440px;',
    '  box-sizing: border-box;',
    '  text-align: center;',
    '}',
    '.menu-popup.active { opacity: 1; visibility: visible; transform: translate(-50%, -50%) scale(1); }',
    '.menu-popup a {',
    '  display: block;',
    '  font-family: "Bebas Neue", sans-serif;',
    '  font-size: clamp(16px, 4.5vw, 22px);',
    '  color: #000;',
    '  text-decoration: none;',
    '  letter-spacing: 4px;',
    '  padding: 12px 0;',
    '  border-bottom: 1px solid #eee;',
    '  transition: color 0.3s;',
    '  white-space: nowrap;',
    '}',
    '.menu-popup a:last-child { border-bottom: none; }',
    '.menu-popup a:hover { color: #999; }',
    '.menu-home-link { text-align: center; }',
    '@media (max-width: 768px) {',
    '  .toolbar-header { padding: 8px 15px; }',
    '  .menu-popup {',
    '    padding: 30px 20px;',
    '  }',
    '}'
  ].join('\n');

  // 计算相对路径前缀 (用于子目录页面)
  function getRelativePath() {
    var path = window.location.pathname;
    if (path.indexOf('/works/') !== -1) {
      return '../';
    }
    return '';
  }

  // 注入CSS
  function injectStyles() {
    if (document.getElementById('shared-toolbar-styles')) return;
    var style = document.createElement('style');
    style.id = 'shared-toolbar-styles';
    style.textContent = TOOLBAR_CSS;
    document.head.appendChild(style);
  }

  // 注入工具栏HTML
  function injectToolbar() {
    if (document.getElementById('sharedToolbar')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = TOOLBAR_HTML; // 此处已统一修复为正确变量名 TOOLBAR_HTML，杜绝报错崩溃
    while (wrap.firstChild) {
      document.body.insertBefore(wrap.firstChild, document.body.firstChild);
    }
  }

  // 绑定事件
  function bindEvents() {
    var customCursor = document.getElementById('customCursor');
    var cursorSvg = document.getElementById('cursorSvg');
    var isClicking = false;
    function setCursorMinus() {
      if (cursorSvg) cursorSvg.innerHTML = '<rect fill="#040000" x="21.3" y="26.4" width="13.31" height="3.11"/>';
    }
    function setCursorPlus() {
      if (cursorSvg) cursorSvg.innerHTML = '<rect fill="#040000" x="21.3" y="21.3" width="13.31" height="3.11"/><rect fill="#040000" x="26.4" y="16.2" width="3.11" height="13.31"/>';
    }

    var menuBtn = document.getElementById('menu-btn');
    var userBtn = document.getElementById('user-btn');
    var menuPopup = document.getElementById('menuPopup');
    var base = getRelativePath();

    function bindHover(el) {
      if (!el) return;
      el.addEventListener('mouseenter', function() {
        if (customCursor) customCursor.classList.add('hovering');
        if (!isClicking) setCursorPlus();
      });
      el.addEventListener('mouseleave', function() {
        if (customCursor) customCursor.classList.remove('hovering');
        if (!isClicking) setCursorMinus();
      });
    }

    if (menuBtn) {
      bindHover(menuBtn);
      menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menuPopup) menuPopup.classList.toggle('active');
      });
    }
    if (userBtn) {
      bindHover(userBtn);
      userBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = base + 'profile.html';
      });
    }
    if (menuPopup) {
      document.addEventListener('click', function(e) {
        if (menuPopup.classList.contains('active') && e.target !== menuBtn && !menuPopup.contains(e.target)) {
          menuPopup.classList.remove('active');
        }
      });
    }
  }

  // 初始化
  function init() {
    injectStyles();
    injectToolbar();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
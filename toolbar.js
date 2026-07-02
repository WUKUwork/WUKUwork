(function() {
  // 高清矢量 SVG 导航栏 HTML 结构 (已去除选项前缀符号)
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
    '  <div class="toolbar-center-text" onclick="window.location.href=\'' + getRelativePath() + 'index.html\'">WUKUwork-+5</div>',
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
    '  <a href="' + getRelativePath() + 'works.html">UnIqUe PrOdUcT</a>',
    '  <a href="' + getRelativePath() + 'visual.html">ViSuAl WoRkS</a>',
    '  <a href="' + getRelativePath() + 'about.html">AbOuT WUKU</a>',
    '  <a href="' + getRelativePath() + 'contact.html">CoNtAcT WUKU</a>',
    '</div>'
  ].join('\n');

  // 工具栏CSS - 所有行完全保持居中
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
    '.toolbar-left-btn { width: 23.07px; flex-shrink: 0; cursor: pointer; }',
    '.toolbar-center-text {',
    '  position: absolute;                             /* 绝对定位实现真正的水平垂直居中 */',
    '  left: 50%;',
    '  top: 50%;',
    '  transform: translate(-50%, -50%);',
    '  font-family: "Plix-SemiBold", "Bebas Neue", sans-serif !important; /* 已修改为 字体 */',
    '  font-size: clamp(18px, 4.5vw, 24px) !important;',
    '  color: #231815 !important;',
    '  font-weight: normal !important;',
    '  letter-spacing: 1px;',
    '  cursor: pointer;',
    '  white-space: nowrap;                            /* 避免文字换行 */',
    '  line-height: 1;                                 /* 限制行高以防止自定义字体的纵向指标过大导致滚动 */',
    '  overflow: hidden;                               /* 隐藏滚动条 */',
    '}',
    '.toolbar-right-btn { width: 23.07px; flex-shrink: 0; cursor: pointer; }',
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
    '  font-family: "Plix-SemiBold", "Bebas Neue", sans-serif; /* 已修改为 Regular 字体 */',
    '  font-size: clamp(16px, 4.5vw, 22px);',
    '  color: #000;',
    '  text-decoration: none;',
    '  letter-spacing: 1px;                                   /* 已修改菜单字间距为 1px */',
    '  padding: 12px 0;',
    '  border-bottom: 1px solid #eee;',
    '  transition: color 0.3s;',
    '  white-space: nowrap;',
    '  text-align: center;   /* 所有菜单项直接居中对齐 */',
    '}',
    '.menu-popup a:last-child { border-bottom: none; }',
    '.menu-popup a:hover { color: #999; }',
    '.menu-home-link { text-align: center !important; }',
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

  // 注入CSS并加载本地字体文件
  function injectStyles() {
    if (document.getElementById('shared-toolbar-styles')) return;
    var style = document.createElement('style');
    style.id = 'shared-toolbar-styles';

    var relativePath = getRelativePath();
    // 【核心修正】：统一将此处声明的名称改为 "Plix-SemiBold"，对应的资源调用 Plix-SemiBold.woff
    var fontFaceCSS = [
      '@font-face {',
      '  font-family: "Plix-SemiBold";',
      '  src: url("' + relativePath + 'Plix-SemiBold.woff") format("woff");',
      '  font-weight: normal;',
      '  font-style: normal;',
      '}'
    ].join('\n');

    style.textContent = fontFaceCSS + '\n' + TOOLBAR_CSS;
    document.head.appendChild(style);
  }

  // 注入工具栏HTML
  function injectToolbar() {
    if (document.getElementById('sharedToolbar')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = TOOLBAR_HTML;
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
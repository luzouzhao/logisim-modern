/* 主题切换模块（独立于核心逻辑）：
   - 通过 <html data-theme="..."> 切换深浅色，样式由 style.css 的 CSS 变量驱动
   - 仅重绘 JointJS 画布背景，不改动任何图形/连线/模型数据
   - 使用 localStorage 记忆用户选择 */
(function () {
    var STORAGE_KEY = 'logicsim-theme';
    var DEFAULT_THEME = 'light';

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) { }
    }

    /* 从 CSS 变量读取画布背景色，保证主题与样式单一来源 */
    function canvasBgColor() {
        var v = getComputedStyle(document.documentElement)
            .getPropertyValue('--canvas-bg');
        v = (v || '').trim();
        return v || 'rgba(150, 250, 200, 0.3)';
    }

    /* 重绘 JointJS 画布背景（主画布 + 小地图），不影响 cells */
    function repaintCanvas() {
        var color = canvasBgColor();
        [window.paper, window.miniPaperJ].forEach(function (p) {
            if (p && p.options) {
                p.options.background = { color: color };
                if (typeof p.drawBackground === 'function') {
                    p.drawBackground();
                }
            }
        });
    }

    function updateButton(theme) {
        var btn = document.getElementById('themeToggle');
        if (btn) {
            btn.textContent = (theme === 'dark') ? '浅色主题' : '深色主题';
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        repaintCanvas();
        updateButton(theme);
    }

    function toggleTheme() {
        var next = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'light' : 'dark';
        storeTheme(next);
        applyTheme(next);
    }

    /* 尽早应用，避免页面闪烁 */
    applyTheme(getStoredTheme() === 'dark' ? 'dark' : DEFAULT_THEME);

    document.addEventListener('DOMContentLoaded', function () {
        /* 此时 ViewGen.js 已创建 paper，重绘一次以同步主题背景 */
        applyTheme(document.documentElement.getAttribute('data-theme') || DEFAULT_THEME);
        var btn = document.getElementById('themeToggle');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    });
})();

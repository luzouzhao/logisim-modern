/* 统一交互提示模块（独立于核心逻辑）：
   - 提供 window.notify(message, type)，type 取值 info | success | error
   - 同时更新底部状态栏文本 + 右上角浮层提示（toast）
   - 仅负责"提示的呈现"，不参与任何业务判断，不修改 graph/cells/模型数据 */
(function () {
    var ICONS = {
        info: 'i',
        success: '\u2713',
        error: '!'
    };

    /* 页面初始脚本执行期间（首次 app.load()）不弹浮层，
       避免加载即出现的提示打扰用户；状态栏文本始终照常更新。 */
    var ready = false;
    document.addEventListener('DOMContentLoaded', function () {
        ready = true;
    });

    function ensureContainer() {
        var c = document.getElementById('toast-container');
        if (!c) {
            c = document.createElement('div');
            c.id = 'toast-container';
            document.body.appendChild(c);
        }
        return c;
    }

    function showToast(message, type) {
        var container = ensureContainer();
        var el = document.createElement('div');
        el.className = 'toast toast-' + type;

        var icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.textContent = ICONS[type] || ICONS.info;

        var text = document.createElement('span');
        text.className = 'toast-text';
        text.textContent = message;

        el.appendChild(icon);
        el.appendChild(text);
        container.appendChild(el);

        /* 触发进入动画 */
        requestAnimationFrame(function () {
            el.classList.add('toast-show');
        });

        var timer = setTimeout(remove, 3200);
        el.addEventListener('click', function () {
            clearTimeout(timer);
            remove();
        });

        function remove() {
            el.classList.remove('toast-show');
            el.addEventListener('transitionend', function () {
                if (el.parentNode) { el.parentNode.removeChild(el); }
            });
            /* 兜底移除，避免 transitionend 未触发时残留 */
            setTimeout(function () {
                if (el.parentNode) { el.parentNode.removeChild(el); }
            }, 400);
        }
    }

    function updateStatusBar(message, type) {
        var statusEl = document.getElementById('status');
        if (!statusEl) { return; }
        statusEl.textContent = message;
        statusEl.style.color = '';
        statusEl.className = 'status-' + type;
    }

    window.notify = function (message, type) {
        type = type || 'info';
        if (type !== 'success' && type !== 'error') { type = 'info'; }
        updateStatusBar(message, type);
        if (ready) {
            showToast(message, type);
        }
    };
})();

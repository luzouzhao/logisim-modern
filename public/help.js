/* 使用说明弹窗模块（独立于核心逻辑）：
   - app.openHelp / app.closeHelp 控制弹窗显示
   - 支持点击遮罩、按 Esc 关闭
   - 纯 UI，不影响 graph/cells/模型数据 */
(function () {
    var modal = document.getElementById('helpModal');
    if (!modal) { return; }

    function open() {
        modal.classList.add('modal-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function close() {
        modal.classList.remove('modal-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    app.openHelp = open;
    app.closeHelp = close;

    /* 点击遮罩（非面板内部）关闭 */
    modal.addEventListener('click', function (e) {
        if (e.target === modal) { close(); }
    });

    /* Esc 关闭 */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
            close();
        }
    });
})();

/* 响应式重排模块（独立于核心逻辑）：
   - 仅监听窗口尺寸变化，重新计算画布容器与缩略图的布局
   - 只调用 ViewGen.js 中已有的布局函数 setContainerAndMini()，不修改 graph/cells/模型数据 */
(function () {
    var timer = null;

    function relayout() {
        if (!window.paper) { return; }
        try {
            /* 容器尺寸变化后，按 paper 内容重算容器与缩略图尺寸 */
            if (typeof window.setContainerAndMini === 'function') {
                window.setContainerAndMini();
            }
            /* 将主画布在可用区域内重新居中 */
            var mc = window.mainContainer;
            var pc = window.paperContainer;
            if (mc && pc && mc.length && pc.length) {
                pc.css({
                    position: 'absolute',
                    left: Math.round((mc.width() - pc.width()) / 2),
                    top: Math.round((mc.height() - pc.height()) / 2)
                });
            }
            /* 同步缩略图可视框位置 */
            var mv = window.miniView;
            if (mv && mv.length && pc && typeof window.miniScale === 'number') {
                mv.css({
                    height: window.miniScale * mc.height(),
                    width: window.miniScale * mc.width(),
                    left: -1 * window.miniScale * pc.position().left,
                    top: -1 * window.miniScale * pc.position().top
                });
            }
        } catch (e) { }
    }

    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(relayout, 150);
    });
})();

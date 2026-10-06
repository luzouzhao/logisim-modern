/* 逻辑门工具栏模块（独立于核心逻辑，A 方案：表达式输入辅助）：
   - 点击按钮把运算符 / 变量 / 常量的 token 插入到 #ReversePol 光标位置
   - 仅操作输入框文本，不触发解析、不修改 graph/cells/模型数据
   - 插入后派发 input 事件，让 exprHelper.js 的校验提示同步刷新 */
(function () {
    var input = document.getElementById('ReversePol');
    var toolbar = document.getElementById('gateToolbar');
    if (!input || !toolbar) { return; }

    var TOKEN_SEPARATOR = ' ';

    /* 在光标处插入文本，保留原有选区语义 */
    function insertAtCursor(text) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var value = input.value;

        /* 若光标前既非空白也非行首，自动补一个空格作为 token 分隔 */
        var needsLeadingSpace = start > 0 && !/\s$/.test(value.slice(0, start));
        var insert = (needsLeadingSpace ? TOKEN_SEPARATOR : '') + text;
        if (start === end) {
            insert += TOKEN_SEPARATOR;
        }

        input.value = value.slice(0, start) + insert + value.slice(end);
        var caret = start + insert.length;
        input.setSelectionRange(caret, caret);
        input.focus();

        /* 通知校验模块刷新提示（不触发解析建模） */
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function clearInput() {
        input.value = '';
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    toolbar.addEventListener('click', function (e) {
        var btn = e.target.closest('.gate-btn');
        if (!btn) { return; }
        e.preventDefault();
        if (btn.hasAttribute('data-clear')) {
            clearInput();
        } else if (btn.hasAttribute('data-token')) {
            insertAtCursor(btn.getAttribute('data-token'));
        }
    });

    /* 阻止工具栏按钮抢走输入框焦点（保持光标位置） */
    toolbar.addEventListener('mousedown', function (e) {
        if (e.target.closest('.gate-btn')) {
            e.preventDefault();
        }
    });
})();

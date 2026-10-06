/* 表达式辅助模块（独立于核心逻辑）：
   - 实时校验：只读调用全局 LogicParser()，用其"返回字符串即错误"的既有契约判断合法性
   - 示例 chip：点击把示例表达式填入输入框
   - 不修改 LogicParser.js，不改动 graph/cells/模型数据 */
(function () {
    var input = document.getElementById('ReversePol');
    var hint = document.getElementById('exprHint');
    if (!input || !hint) { return; }

    function setHint(text, cls) {
        hint.textContent = text;
        hint.className = 'expr-hint' + (cls ? ' ' + cls : '');
    }

    /* 仅做语法校验，不触发建模/绘图，避免副作用 */
    function validate() {
        var value = input.value;
        if (!value || '' === value.trim()) {
            setHint('');
            return;
        }
        var result = LogicParser(value);
        if ('string' === typeof result) {
            setHint(result, 'expr-hint-error');
        } else {
            setHint('表达式格式正确', 'expr-hint-ok');
        }
    }

    input.addEventListener('input', validate);

    var samples = document.querySelectorAll('.expr-chip[data-expr]');
    for (var i = 0; i < samples.length; i++) {
        samples[i].addEventListener('click', function () {
            input.value = this.getAttribute('data-expr');
            validate();
            input.focus();
        });
    }
})();

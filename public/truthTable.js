/* 真值表工具模块（独立于核心逻辑）：
   - 只读复用全局 LogicParser() 与 ModelGen()，与其决策表 {value, order} 保持同一语义
   - 枚举全部变量组合，从决策表求解输出，渲染为表格
   - 不修改 LogicParser.js，不改动 graph/cells/模型数据 */
(function () {
    var modal = document.getElementById('truthModal');
    if (!modal) { return; }
    var contentEl = document.getElementById('truthTableContent');
    var exprEl = document.getElementById('truthExpr');

    /* ModelGen 中 ">" 表示 1，"<" 表示 0 */
    var ONE = '>';
    var ZERO = '<';

    /* 对给定变量组合从决策表求值，兼容 don't care（entry 中缺省的变量） */
    function evalCombo(value, order, combo) {
        var found = null;
        for (var i = 0; i < value.length; i++) {
            var entry = value[i];
            var ok = true;
            for (var j = 0; j < order.length; j++) {
                var v = order[j];
                if (entry[v] !== undefined && entry[v] !== combo[v]) { ok = false; break; }
            }
            if (ok) {
                /* 同一组合若被多条规则覆盖，输出应一致；不一致则标记为未知 */
                if (found !== null && found !== entry['.']) { return null; }
                found = entry['.'];
            }
        }
        return found;
    }

    function buildTable(model) {
        var order = model.order || [];
        var value = model.value || [];
        var n = order.length;

        var table = document.createElement('table');
        table.className = 'truth-table';

        var thead = document.createElement('thead');
        var htr = document.createElement('tr');
        order.forEach(function (v) {
            var th = document.createElement('th');
            th.textContent = v;
            htr.appendChild(th);
        });
        var thOut = document.createElement('th');
        thOut.textContent = '结果';
        htr.appendChild(thOut);
        thead.appendChild(htr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        var rows = Math.pow(2, n);
        for (var r = 0; r < rows; r++) {
            var combo = {};
            var tr = document.createElement('tr');
            for (var k = 0; k < n; k++) {
                /* order[0] 视为最高位，与常规真值表书写一致 */
                var bit = (r >> (n - 1 - k)) & 1;
                combo[order[k]] = bit ? ONE : ZERO;
                var td = document.createElement('td');
                td.textContent = bit;
                tr.appendChild(td);
            }
            var res = evalCombo(value, order, combo);
            var tdOut = document.createElement('td');
            tdOut.className = 'truth-out';
            tdOut.textContent = (res === null) ? '?' : (res === ONE ? '1' : '0');
            tr.appendChild(tdOut);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        return table;
    }

    app.showTruthTable = function () {
        var input = document.getElementById('ReversePol');
        var exprText = input ? input.value : '';
        var parsed = LogicParser(exprText);

        /* 复用原解析器的错误契约：返回字符串即为错误 */
        if ('string' === typeof parsed) {
            notify(parsed, 'error');
            return;
        }
        var model = ModelGen(parsed);
        if (!model || !model.value || model.value.length === 0) {
            notify('无法生成真值表。', 'error');
            return;
        }
        exprEl.textContent = '表达式：' + String(exprText).trim();
        contentEl.innerHTML = '';
        contentEl.appendChild(buildTable(model));
        modal.classList.add('modal-open');
        modal.setAttribute('aria-hidden', 'false');
    };

    app.closeTruthTable = function () {
        modal.classList.remove('modal-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    /* 点击遮罩关闭 */
    modal.addEventListener('click', function (e) {
        if (e.target === modal) { app.closeTruthTable(); }
    });

    /* Esc 关闭 */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
            app.closeTruthTable();
        }
    });
})();

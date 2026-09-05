import { useState, useEffect } from 'react';

function CalculatorPanel() {
  const [tokens, setTokens] = useState(['0']); 
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('calc-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  const lastToken = () => tokens[tokens.length - 1];
  const isOperator = (t) => ['+', '-', '×', '÷'].includes(t);

  const inputDigit = (digit) => {
    setTokens((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (isOperator(last)) {
        copy.push(digit);
      } else if (last === '0') {
        copy[copy.length - 1] = digit;
      } else {
        copy[copy.length - 1] = last + digit;
      }
      return copy;
    });
  };

  const inputDecimal = () => {
    setTokens((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (isOperator(last)) {
        copy.push('0.');
      } else if (!last.includes('.')) {
        copy[copy.length - 1] = last + '.';
      }
      return copy;
    });
  };

  const inputOperator = (op) => {
    setTokens((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (isOperator(last)) {
        copy[copy.length - 1] = op;
      } else {
        copy.push(op);
      }
      return copy;
    });
  };

  const clear = () => setTokens(['0']);

  const toggleSign = () => {
    setTokens((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (!isOperator(last)) {
        copy[copy.length - 1] = String(parseFloat(last || '0') * -1);
      }
      return copy;
    });
  };

  const percent = () => {
    setTokens((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (!isOperator(last)) {
        copy[copy.length - 1] = String(parseFloat(last || '0') / 100);
      }
      return copy;
    });
  };

  const evaluate = (tkns) => {
    let result = parseFloat(tkns[0]);
    for (let i = 1; i < tkns.length; i += 2) {
      const op = tkns[i];
      const next = parseFloat(tkns[i + 1]);
      if (isNaN(next)) break;
      if (op === '+') result += next;
      else if (op === '-') result -= next;
      else if (op === '×') result *= next;
      else if (op === '÷') result = next === 0 ? NaN : result / next;
    }
    return result;
  };

  const handleEquals = () => {
    if (tokens.length < 3 || isOperator(lastToken())) return;
    const expr = tokens.join(' ');
    const result = evaluate(tokens);
    const resultStr = Number.isNaN(result) ? 'Error' : String(result);

    setHistory((prev) => [{ id: Date.now(), expr, result: resultStr }, ...prev].slice(0, 10));
    setTokens([resultStr]);
  };

  const reuseHistoryResult = (resultStr) => {
    setTokens([resultStr]);
    setShowHistory(false);
  };

  const clearHistory = () => setHistory([]);

  const buttons = [
    { label: 'C', onClick: clear, className: 'calc-fn' },
    { label: '±', onClick: toggleSign, className: 'calc-fn' },
    { label: '%', onClick: percent, className: 'calc-fn' },
    { label: '÷', onClick: () => inputOperator('÷'), className: 'calc-op' },
    { label: '7', onClick: () => inputDigit('7') },
    { label: '8', onClick: () => inputDigit('8') },
    { label: '9', onClick: () => inputDigit('9') },
    { label: '×', onClick: () => inputOperator('×'), className: 'calc-op' },
    { label: '4', onClick: () => inputDigit('4') },
    { label: '5', onClick: () => inputDigit('5') },
    { label: '6', onClick: () => inputDigit('6') },
    { label: '−', onClick: () => inputOperator('-'), className: 'calc-op' },
    { label: '1', onClick: () => inputDigit('1') },
    { label: '2', onClick: () => inputDigit('2') },
    { label: '3', onClick: () => inputDigit('3') },
    { label: '+', onClick: () => inputOperator('+'), className: 'calc-op' },
    { label: '0', onClick: () => inputDigit('0'), className: 'calc-zero' },
    { label: '.', onClick: inputDecimal },
    { label: '=', onClick: handleEquals, className: 'calc-op calc-equals' },
  ];

  return (
    <div className="calculator">
      <div className="calc-top-row">
        <span className="calc-formula">{tokens.join(' ')}</span>
        <button className="calc-history-toggle" onClick={() => setShowHistory((s) => !s)}>
          🕘
        </button>
      </div>

      {showHistory ? (
        <div className="calc-history-panel">
          {history.length === 0 && <div className="calc-history-empty">No calculations yet</div>}
          {history.map((h) => (
            <div key={h.id} className="calc-history-item" onClick={() => reuseHistoryResult(h.result)}>
              <span className="calc-history-expr">{h.expr}</span>
              <span className="calc-history-result">= {h.result}</span>
            </div>
          ))}
          {history.length > 0 && (
            <button className="calc-history-clear" onClick={clearHistory}>Clear history</button>
          )}
        </div>
      ) : (
        <>
          <div className="calc-display">{lastToken()}</div>
          <div className="calc-grid">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                className={`calc-btn ${btn.className || ''}`}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CalculatorPanel;
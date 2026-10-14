function evaluate(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  let i = 0;
  const n = expr.length;

  while (i < n) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if ('+-*/^()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let numStr = '';
      let dotCount = 0;
      let digitCount = 0;

      while (i < n && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
        if (expr[i] === '.') {
          dotCount++;
          if (dotCount > 1) return null;
        } else {
          digitCount++;
        }
        numStr += expr[i];
        i++;
      }

      if (digitCount === 0 || numStr.endsWith('.')) return null;

      const val = Number(numStr);
      if (!Number.isFinite(val)) return null;
      tokens.push({ type: 'num', value: val });
      continue;
    }

    return null;
  }

  if (tokens.length === 0) return null;

  let pos = 0;

  function peek() {
    return pos < tokens.length ? tokens[pos] : null;
  }

  function consume() {
    return tokens[pos++];
  }

  function parseExpr() {
    let left = parseTerm();
    if (left === null) return null;

    while (true) {
      const tok = peek();
      if (tok && tok.type === 'op' && (tok.value === '+' || tok.value === '-')) {
        consume();
        const right = parseTerm();
        if (right === null) return null;
        left = tok.value === '+' ? left + right : left - right;
        if (!Number.isFinite(left)) return null;
      } else {
        break;
      }
    }
    return left;
  }

  function parseTerm() {
    let left = parseUnary();
    if (left === null) return null;

    while (true) {
      const tok = peek();
      if (tok && tok.type === 'op' && (tok.value === '*' || tok.value === '/')) {
        consume();
        const right = parseUnary();
        if (right === null) return null;
        if (tok.value === '*') {
          left = left * right;
        } else {
          if (right === 0) return null;
          left = left / right;
        }
        if (!Number.isFinite(left)) return null;
      } else {
        break;
      }
    }
    return left;
  }

  function parseUnary() {
    const tok = peek();
    if (tok && tok.type === 'op' && (tok.value === '+' || tok.value === '-')) {
      consume();
      const val = parseUnary();
      if (val === null) return null;
      const res = tok.value === '-' ? -val : +val;
      return res === 0 ? 0 : res;
    }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (base === null) return null;

    const tok = peek();
    if (tok && tok.type === 'op' && tok.value === '^') {
      consume();
      const exp = parseUnary();
      if (exp === null) return null;
      if (base === 0 && exp < 0) return null;
      const res = Math.pow(base, exp);
      if (!Number.isFinite(res)) return null;
      return res;
    }
    return base;
  }

  function parsePrimary() {
    const tok = peek();
    if (!tok) return null;

    if (tok.type === 'num') {
      consume();
      return tok.value;
    }

    if (tok.type === 'op' && tok.value === '(') {
      consume();
      const closeCheck = peek();
      if (closeCheck && closeCheck.type === 'op' && closeCheck.value === ')') {
        return null;
      }
      const val = parseExpr();
      if (val === null) return null;
      const next = peek();
      if (!next || next.type !== 'op' || next.value !== ')') {
        return null;
      }
      consume();
      return val;
    }

    return null;
  }

  const result = parseExpr();
  if (result === null || pos < tokens.length || !Number.isFinite(result)) {
    return null;
  }

  return result === 0 ? 0 : result;
}

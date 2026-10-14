function evaluate(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  const numRe = /^(?:\d+(?:\.\d+)?|\.\d+)/;
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      const m = numRe.exec(expr.slice(i));
      if (!m) return null;
      tokens.push({ type: 'num', value: parseFloat(m[0]) });
      i += m[0].length;
      continue;
    }
    if ('+-*/^()'.includes(ch)) {
      tokens.push({ type: ch });
      i++;
      continue;
    }
    return null;
  }
  if (tokens.length === 0) return null;

  const INVALID = { kind: 'invalid' };
  const DIV_ZERO = { kind: 'divzero' };
  let pos = 0;

  const peek = () => (pos < tokens.length ? tokens[pos].type : null);

  function parseExpr() {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = tokens[pos++].type;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseUnary();
    while (peek() === '*' || peek() === '/') {
      const op = tokens[pos++].type;
      const right = parseUnary();
      if (op === '*') {
        left = left * right;
      } else {
        if (right === 0) throw DIV_ZERO;
        left = left / right;
      }
    }
    return left;
  }

  function parseUnary() {
    const t = peek();
    if (t === '-') {
      pos++;
      return -parseUnary();
    }
    if (t === '+') {
      pos++;
      return parseUnary();
    }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (peek() === '^') {
      pos++;
      const exponent = parseUnary();
      return Math.pow(base, exponent);
    }
    return base;
  }

  function parsePrimary() {
    const t = peek();
    if (t === 'num') {
      return tokens[pos++].value;
    }
    if (t === '(') {
      pos++;
      const value = parseExpr();
      if (peek() !== ')') throw INVALID;
      pos++;
      return value;
    }
    throw INVALID;
  }

  try {
    const result = parseExpr();
    if (pos !== tokens.length) return null;
    return result;
  } catch (e) {
    if (e === INVALID || e === DIV_ZERO) return null;
    throw e;
  }
}

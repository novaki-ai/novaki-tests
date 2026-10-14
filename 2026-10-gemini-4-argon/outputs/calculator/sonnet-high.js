function evaluate(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  const numRe = /\d+\.\d+|\d+|\.\d+/y;
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    numRe.lastIndex = i;
    const m = numRe.exec(expr);
    if (m) {
      tokens.push({ num: parseFloat(m[0]) });
      i += m[0].length;
    } else if ('+-*/^()'.includes(c)) {
      tokens.push({ op: c });
      i++;
    } else {
      return null;
    }
  }

  let p = 0;
  const isOp = (...ops) => p < tokens.length && ops.includes(tokens[p].op);

  function parseExpr() {
    let v = parseTerm();
    while (isOp('+', '-')) {
      const op = tokens[p++].op;
      const r = parseTerm();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }

  function parseTerm() {
    let v = parseUnary();
    while (isOp('*', '/')) {
      const op = tokens[p++].op;
      const r = parseUnary();
      if (op === '*') {
        v *= r;
      } else {
        if (r === 0) throw new Error('div0');
        v /= r;
      }
    }
    return v;
  }

  function parseUnary() {
    if (isOp('+', '-')) {
      const op = tokens[p++].op;
      const v = parseUnary();
      return op === '-' ? -v : v;
    }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (isOp('^')) {
      p++;
      return Math.pow(base, parseExponent());
    }
    return base;
  }

  function parseExponent() {
    if (isOp('+', '-')) {
      const op = tokens[p++].op;
      const v = parseExponent();
      return op === '-' ? -v : v;
    }
    return parsePower();
  }

  function parsePrimary() {
    if (p >= tokens.length) throw new Error('unexpected end');
    const t = tokens[p];
    if (t.num !== undefined) {
      p++;
      return t.num;
    }
    if (t.op === '(') {
      p++;
      const v = parseExpr();
      if (!isOp(')')) throw new Error('missing )');
      p++;
      return v;
    }
    throw new Error('unexpected token');
  }

  try {
    const v = parseExpr();
    if (p !== tokens.length) return null;
    if (!Number.isFinite(v)) return null;
    return v === 0 ? 0 : v;
  } catch (e) {
    return null;
  }
}

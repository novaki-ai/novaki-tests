function evaluate(expr) {
  if (typeof expr !== 'string') return null;
  const s = expr;
  let i = 0;
  const numRe = /\d+(?:\.\d+)?|\.\d+/y;

  const fail = () => { throw new Error('invalid'); };
  const peek = () => {
    while (i < s.length && /\s/.test(s[i])) i++;
    return s[i];
  };

  function parseExpr() {
    let v = parseTerm();
    for (let c = peek(); c === '+' || c === '-'; c = peek()) {
      i++;
      const r = parseTerm();
      v = c === '+' ? v + r : v - r;
    }
    return v;
  }

  function parseTerm() {
    let v = parseUnary();
    for (let c = peek(); c === '*' || c === '/'; c = peek()) {
      i++;
      const r = parseUnary();
      if (c === '*') {
        v *= r;
      } else {
        if (r === 0) fail();
        v /= r;
      }
    }
    return v;
  }

  function parseUnary() {
    let sign = 1;
    for (let c = peek(); c === '+' || c === '-'; c = peek()) {
      if (c === '-') sign = -sign;
      i++;
    }
    const v = parsePower();
    return sign === 1 ? v : -v;
  }

  function parsePower() {
    const base = parsePrimary();
    if (peek() === '^') {
      i++;
      const exp = parseUnary();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parsePrimary() {
    const c = peek();
    if (c === '(') {
      i++;
      const v = parseExpr();
      if (peek() !== ')') fail();
      i++;
      return v;
    }
    numRe.lastIndex = i;
    const m = numRe.exec(s);
    if (!m) fail();
    i += m[0].length;
    return parseFloat(m[0]);
  }

  try {
    const v = parseExpr();
    if (peek() !== undefined) return null;
    if (!Number.isFinite(v)) return null;
    return v + 0;
  } catch (e) {
    return null;
  }
}

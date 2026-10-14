function evaluate(expr) {
  if (typeof expr !== 'string') return null;
  const s = expr;
  let i = 0;

  const fail = () => { throw new Error('invalid'); };
  const skip = () => { while (i < s.length && /\s/.test(s[i])) i++; };
  const peek = () => { skip(); return i < s.length ? s[i] : null; };

  function parseExpr() {
    let v = parseTerm();
    for (;;) {
      const c = peek();
      if (c === '+') { i++; v += parseTerm(); }
      else if (c === '-') { i++; v -= parseTerm(); }
      else return v;
    }
  }

  function parseTerm() {
    let v = parseUnary();
    for (;;) {
      const c = peek();
      if (c === '*') { i++; v *= parseUnary(); }
      else if (c === '/') {
        i++;
        const d = parseUnary();
        if (d === 0) fail();
        v /= d;
      } else return v;
    }
  }

  function parseUnary() {
    const c = peek();
    if (c === '-') { i++; return -parseUnary(); }
    if (c === '+') { i++; return parseUnary(); }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (peek() === '^') {
      i++;
      const exp = parseUnary();
      const r = Math.pow(base, exp);
      if (!Number.isFinite(r)) fail();
      return r;
    }
    return base;
  }

  function parsePrimary() {
    const c = peek();
    if (c === null) fail();
    if (c === '(') {
      i++;
      const v = parseExpr();
      if (peek() !== ')') fail();
      i++;
      return v;
    }
    const m = /^(?:\d+(?:\.\d+)?|\.\d+)/.exec(s.slice(i));
    if (!m) fail();
    i += m[0].length;
    return parseFloat(m[0]);
  }

  try {
    const v = parseExpr();
    if (peek() !== null) fail();
    return Number.isFinite(v) ? v : null;
  } catch (e) {
    return null;
  }
}

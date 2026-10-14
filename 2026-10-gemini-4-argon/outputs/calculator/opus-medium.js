function evaluate(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      const m = /^(?:\d+(?:\.\d+)?|\.\d+)/.exec(expr.slice(i));
      if (!m) return null;
      i += m[0].length;
      if (i < expr.length && /[0-9.]/.test(expr[i])) return null;
      tokens.push({ type: 'num', value: parseFloat(m[0]) });
      continue;
    }
    if ('+-*/^()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }
    return null;
  }

  if (tokens.length === 0) return null;

  const fail = {};
  let pos = 0;

  const peek = () => tokens[pos];
  const isOp = (v) => {
    const t = tokens[pos];
    return t !== undefined && t.type === 'op' && t.value === v;
  };

  function parseExpr() {
    let left = parseTerm();
    while (isOp('+') || isOp('-')) {
      const op = tokens[pos++].value;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseUnary();
    while (isOp('*') || isOp('/')) {
      const op = tokens[pos++].value;
      const right = parseUnary();
      if (op === '*') {
        left = left * right;
      } else {
        if (right === 0) throw fail;
        left = left / right;
      }
    }
    return left;
  }

  function parseUnary() {
    if (isOp('-')) {
      pos++;
      return -parseUnary();
    }
    if (isOp('+')) {
      pos++;
      return parseUnary();
    }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (isOp('^')) {
      pos++;
      const exponent = parseUnary();
      return Math.pow(base, exponent);
    }
    return base;
  }

  function parsePrimary() {
    const t = peek();
    if (t === undefined) throw fail;
    if (t.type === 'num') {
      pos++;
      return t.value;
    }
    if (t.value === '(') {
      pos++;
      const value = parseExpr();
      if (!isOp(')')) throw fail;
      pos++;
      return value;
    }
    throw fail;
  }

  try {
    const result = parseExpr();
    if (pos !== tokens.length) return null;
    return result;
  } catch (e) {
    if (e === fail) return null;
    throw e;
  }
}

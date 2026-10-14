function evaluate(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if ('+-*/^()'.includes(c)) {
      tokens.push({ type: 'op', value: c });
      i++;
      continue;
    }
    const m = /^(?:\d+(?:\.\d+)?|\.\d+)/.exec(expr.slice(i));
    if (m) {
      tokens.push({ type: 'num', value: parseFloat(m[0]) });
      i += m[0].length;
      continue;
    }
    return null;
  }

  let pos = 0;
  const fail = () => {
    throw new Error('invalid');
  };
  const peekOp = (op) =>
    pos < tokens.length && tokens[pos].type === 'op' && tokens[pos].value === op;

  function parseExpr() {
    let left = parseTerm();
    while (peekOp('+') || peekOp('-')) {
      const op = tokens[pos++].value;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseUnary();
    while (peekOp('*') || peekOp('/')) {
      const op = tokens[pos++].value;
      const right = parseUnary();
      if (op === '*') {
        left = left * right;
      } else {
        if (right === 0) throw new Error('division by zero');
        left = left / right;
      }
    }
    return left;
  }

  function parseUnary() {
    if (peekOp('-')) {
      pos++;
      return -parseUnary();
    }
    if (peekOp('+')) {
      pos++;
      return parseUnary();
    }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (peekOp('^')) {
      pos++;
      const exponent = parseUnary();
      return Math.pow(base, exponent);
    }
    return base;
  }

  function parsePrimary() {
    if (pos >= tokens.length) fail();
    const tok = tokens[pos];
    if (tok.type === 'num') {
      pos++;
      return tok.value;
    }
    if (peekOp('(')) {
      pos++;
      const value = parseExpr();
      if (!peekOp(')')) fail();
      pos++;
      return value;
    }
    fail();
  }

  try {
    const result = parseExpr();
    if (pos !== tokens.length) return null;
    return result;
  } catch (e) {
    return null;
  }
}

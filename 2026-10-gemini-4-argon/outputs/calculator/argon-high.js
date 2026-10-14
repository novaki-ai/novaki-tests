function evaluate(expr) {
  if (typeof expr !== 'string') return null;

  const tokens = [];
  const n = expr.length;
  let i = 0;

  const isDigit = (ch) => ch >= '0' && ch <= '9';

  while (i < n) {
    const ch = expr[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (isDigit(ch) || ch === '.') {
      const start = i;
      while (i < n && isDigit(expr[i])) i++;
      if (i < n && expr[i] === '.') {
        i++;
        const fracStart = i;
        while (i < n && isDigit(expr[i])) i++;
        if (fracStart === i) return null;
      }
      if (i < n && expr[i] === '.') return null;
      const num = Number(expr.slice(start, i));
      if (!Number.isFinite(num)) return null;
      tokens.push(num);
      continue;
    }

    if (
      ch === '+' ||
      ch === '-' ||
      ch === '*' ||
      ch === '/' ||
      ch === '^' ||
      ch === '(' ||
      ch === ')'
    ) {
      tokens.push(ch);
      i++;
      continue;
    }

    return null;
  }

  if (tokens.length === 0) return null;

  let pos = 0;

  function parseExpr() {
    let left = parseTerm();
    if (left === null) return null;
    while (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
      const op = tokens[pos++];
      const right = parseTerm();
      if (right === null) return null;
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseUnary();
    if (left === null) return null;
    while (pos < tokens.length && (tokens[pos] === '*' || tokens[pos] === '/')) {
      const op = tokens[pos++];
      const right = parseUnary();
      if (right === null) return null;
      if (op === '/') {
        if (right === 0) return null;
        left = left / right;
      } else {
        left = left * right;
      }
    }
    return left;
  }

  function parseUnary() {
    if (pos < tokens.length && (tokens[pos] === '+' || tokens[pos] === '-')) {
      const op = tokens[pos++];
      const operand = parseUnary();
      if (operand === null) return null;
      return op === '-' ? -operand : operand;
    }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (base === null) return null;
    if (pos < tokens.length && tokens[pos] === '^') {
      pos++;
      const exponent = parseUnary();
      if (exponent === null) return null;
      const res = Math.pow(base, exponent);
      if (!Number.isFinite(res)) return null;
      return res;
    }
    return base;
  }

  function parsePrimary() {
    if (pos >= tokens.length) return null;
    const tok = tokens[pos];
    if (typeof tok === 'number') {
      pos++;
      return tok;
    }
    if (tok === '(') {
      pos++;
      const val = parseExpr();
      if (val === null || pos >= tokens.length || tokens[pos] !== ')') {
        return null;
      }
      pos++;
      return val;
    }
    return null;
  }

  const result = parseExpr();
  if (result === null || pos !== tokens.length || !Number.isFinite(result)) {
    return null;
  }

  return result === 0 ? 0 : result;
}

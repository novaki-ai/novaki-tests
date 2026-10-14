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
      tokens.push({ type: ch, value: ch });
      i++;
      continue;
    }

    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let start = i;
      let dotCount = 0;
      let digitCount = 0;

      while (i < n && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
        if (expr[i] === '.') {
          dotCount++;
        } else {
          digitCount++;
        }
        i++;
      }

      if (dotCount > 1 || digitCount === 0) {
        return null;
      }

      const numStr = expr.slice(start, i);
      const val = Number(numStr);
      if (Number.isNaN(val)) return null;

      tokens.push({ type: 'NUM', value: val });
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

  // Grammar:
  // Expr   -> Term (( '+' | '-' ) Term)*
  // Term   -> Unary (( '*' | '/' ) Unary)*
  // Unary  -> ( '+' | '-' ) Unary | Power
  // Power  -> Atom ( '^' Unary )?
  // Atom   -> NUM | '(' Expr ')'

  function parseExpr() {
    let left = parseTerm();
    if (left === null) return null;

    while (peek() && (peek().type === '+' || peek().type === '-')) {
      const op = consume().type;
      const right = parseTerm();
      if (right === null) return null;
      left = op === '+' ? left + right : left - right;
    }

    return left;
  }

  function parseTerm() {
    let left = parseUnary();
    if (left === null) return null;

    while (peek() && (peek().type === '*' || peek().type === '/')) {
      const op = consume().type;
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
    if (peek() && (peek().type === '+' || peek().type === '-')) {
      const op = consume().type;
      const operand = parseUnary();
      if (operand === null) return null;
      return op === '-' ? -operand : +operand;
    }
    return parsePower();
  }

  function parsePower() {
    const base = parseAtom();
    if (base === null) return null;

    if (peek() && peek().type === '^') {
      consume();
      const exponent = parseUnary();
      if (exponent === null) return null;
      if (base === 0 && exponent < 0) return null;
      const res = Math.pow(base, exponent);
      if (Number.isNaN(res)) return null;
      return res;
    }

    return base;
  }

  function parseAtom() {
    const tok = peek();
    if (!tok) return null;

    if (tok.type === 'NUM') {
      consume();
      return tok.value;
    }

    if (tok.type === '(') {
      consume();
      if (peek() && peek().type === ')') return null;
      const val = parseExpr();
      if (val === null) return null;
      if (!peek() || peek().type !== ')') return null;
      consume();
      return val;
    }

    return null;
  }

  const result = parseExpr();
  if (result === null || pos < tokens.length || Number.isNaN(result)) {
    return null;
  }

  return result === 0 ? 0 : result;
}

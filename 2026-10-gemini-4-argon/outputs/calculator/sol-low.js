function evaluate(expr) {
  if (typeof expr !== "string") return null;

  let pos = 0;

  function skipWhitespace() {
    while (pos < expr.length && /\s/.test(expr[pos])) pos++;
  }

  function take(char) {
    skipWhitespace();
    if (expr[pos] !== char) return false;
    pos++;
    return true;
  }

  function primary() {
    skipWhitespace();

    if (take("(")) {
      const value = sum();
      if (!take(")")) throw new Error();
      return value;
    }

    const match = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(expr.slice(pos));
    if (!match) throw new Error();

    pos += match[0].length;
    return Number(match[0]);
  }

  function power() {
    const base = primary();
    return take("^") ? base ** unary() : base;
  }

  function unary() {
    if (take("+")) return unary();
    if (take("-")) return -unary();
    return power();
  }

  function product() {
    let value = unary();

    while (true) {
      if (take("*")) {
        value *= unary();
      } else if (take("/")) {
        const divisor = unary();
        if (divisor === 0) throw new Error();
        value /= divisor;
      } else {
        return value;
      }
    }
  }

  function sum() {
    let value = product();

    while (true) {
      if (take("+")) value += product();
      else if (take("-")) value -= product();
      else return value;
    }
  }

  try {
    const value = sum();
    skipWhitespace();
    return pos === expr.length ? value : null;
  } catch {
    return null;
  }
}

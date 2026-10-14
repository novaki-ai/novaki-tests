function evaluate(expr) {
  if (typeof expr !== "string") return null;

  let pos = 0;

  function skipWhitespace() {
    while (pos < expr.length && /\s/.test(expr[pos])) pos++;
  }

  function consume(char) {
    skipWhitespace();
    if (expr[pos] !== char) return false;
    pos++;
    return true;
  }

  function primary() {
    skipWhitespace();

    if (consume("(")) {
      const value = sum();
      if (!consume(")")) throw new Error("Missing closing parenthesis");
      return value;
    }

    const match = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(expr.slice(pos));
    if (!match) throw new Error("Expected number");
    pos += match[0].length;
    return Number(match[0]);
  }

  function power() {
    const base = primary();
    return consume("^") ? base ** unary() : base;
  }

  function unary() {
    let sign = 1;
    while (true) {
      if (consume("+")) continue;
      if (consume("-")) {
        sign = -sign;
        continue;
      }
      return sign * power();
    }
  }

  function product() {
    let value = unary();
    while (true) {
      if (consume("*")) {
        value *= unary();
      } else if (consume("/")) {
        const divisor = unary();
        if (divisor === 0) throw new Error("Division by zero");
        value /= divisor;
      } else {
        return value;
      }
    }
  }

  function sum() {
    let value = product();
    while (true) {
      if (consume("+")) value += product();
      else if (consume("-")) value -= product();
      else return value;
    }
  }

  try {
    const result = sum();
    skipWhitespace();
    return pos === expr.length ? result : null;
  } catch {
    return null;
  }
}

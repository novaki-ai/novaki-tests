function evaluate(expr) {
  if (typeof expr !== "string") return null;

  let pos = 0;

  function skipWhitespace() {
    while (pos < expr.length && /\s/.test(expr[pos])) pos++;
  }

  function primary() {
    skipWhitespace();

    if (expr[pos] === "(") {
      pos++;
      const value = sum();
      skipWhitespace();
      if (expr[pos] !== ")") throw new Error();
      pos++;
      return value;
    }

    const match = /^(?:\d+(?:\.\d*)?|\.\d+)/.exec(expr.slice(pos));
    if (!match) throw new Error();
    pos += match[0].length;
    return Number(match[0]);
  }

  function power() {
    const base = primary();
    skipWhitespace();
    if (expr[pos] === "^") {
      pos++;
      return base ** unary();
    }
    return base;
  }

  function unary() {
    let negative = false;
    skipWhitespace();

    while (expr[pos] === "+" || expr[pos] === "-") {
      if (expr[pos++] === "-") negative = !negative;
      skipWhitespace();
    }

    const value = power();
    return negative ? -value : value;
  }

  function product() {
    let value = unary();

    while (true) {
      skipWhitespace();
      const op = expr[pos];
      if (op !== "*" && op !== "/") return value;
      pos++;

      const right = unary();
      if (op === "/" && right === 0) throw new Error();
      value = op === "*" ? value * right : value / right;
    }
  }

  function sum() {
    let value = product();

    while (true) {
      skipWhitespace();
      const op = expr[pos];
      if (op !== "+" && op !== "-") return value;
      pos++;

      const right = product();
      value = op === "+" ? value + right : value - right;
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

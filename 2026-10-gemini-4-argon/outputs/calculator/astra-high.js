function evaluate(expr) {
  if (typeof expr !== "string") return null;

  let i = 0;

  function skipWhitespace() {
    while (i < expr.length && /\s/.test(expr[i])) i++;
  }

  function primary() {
    skipWhitespace();

    if (expr[i] === "(") {
      i++;
      const value = sum();
      skipWhitespace();
      if (expr[i] !== ")") throw new SyntaxError();
      i++;
      return value;
    }

    const start = i;
    let digits = 0;

    while (i < expr.length && expr[i] >= "0" && expr[i] <= "9") {
      i++;
      digits++;
    }

    if (expr[i] === ".") {
      i++;
      while (i < expr.length && expr[i] >= "0" && expr[i] <= "9") {
        i++;
        digits++;
      }
    }

    if (digits === 0) throw new SyntaxError();
    return Number(expr.slice(start, i));
  }

  function power() {
    const base = primary();
    skipWhitespace();
    if (expr[i] === "^") {
      i++;
      return base ** unary();
    }
    return base;
  }

  function unary() {
    let negative = false;
    skipWhitespace();
    while (expr[i] === "+" || expr[i] === "-") {
      if (expr[i] === "-") negative = !negative;
      i++;
      skipWhitespace();
    }
    const value = power();
    return negative ? -value : value;
  }

  function product() {
    let value = unary();
    while (true) {
      skipWhitespace();
      const op = expr[i];
      if (op !== "*" && op !== "/") return value;
      i++;
      const right = unary();
      if (op === "/" && right === 0) throw new RangeError();
      value = op === "*" ? value * right : value / right;
    }
  }

  function sum() {
    let value = product();
    while (true) {
      skipWhitespace();
      const op = expr[i];
      if (op !== "+" && op !== "-") return value;
      i++;
      const right = product();
      value = op === "+" ? value + right : value - right;
    }
  }

  try {
    const value = sum();
    skipWhitespace();
    return i === expr.length ? value : null;
  } catch {
    return null;
  }
}

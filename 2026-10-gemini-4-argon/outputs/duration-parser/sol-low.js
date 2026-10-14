function parseDuration(text) {
  if (typeof text !== "string") return null;

  const input = text.trim();
  const number = String.raw`(?:\d+(?:\.\d+)?|\.\d+)`;

  if (new RegExp(`^${number}$`).test(input)) {
    const seconds = Number(input);
    return Number.isFinite(seconds) ? seconds : null;
  }

  if (!new RegExp(`^(?:${number}[dhms])(?:\\s*${number}[dhms])*$`, "i").test(input)) {
    return null;
  }

  const units = {
    d: { order: 0, seconds: 86400 },
    h: { order: 1, seconds: 3600 },
    m: { order: 2, seconds: 60 },
    s: { order: 3, seconds: 1 }
  };

  let total = 0;
  let previousOrder = -1;

  for (const match of input.matchAll(new RegExp(`(${number})([dhms])`, "gi"))) {
    const unit = units[match[2].toLowerCase()];
    if (unit.order <= previousOrder) return null;

    previousOrder = unit.order;
    total += Number(match[1]) * unit.seconds;
  }

  return Number.isFinite(total) ? total : null;
}

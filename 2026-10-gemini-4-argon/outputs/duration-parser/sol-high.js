function parseDuration(text) {
  if (typeof text !== "string") return null;

  text = text.trim();
  if (!text) return null;

  const numberPattern = /^(?:\d+(?:\.\d+)?|\.\d+)$/;
  if (numberPattern.test(text)) {
    const seconds = Number(text);
    return Number.isFinite(seconds) ? seconds : null;
  }

  const units = ["d", "h", "m", "s"];
  const multipliers = [86400, 3600, 60, 1];
  const partPattern = /(\d+(?:\.\d+)?|\.\d+)\s*([dhms])\s*/iy;

  let position = 0;
  let previousUnit = -1;
  let total = 0;

  while (position < text.length) {
    partPattern.lastIndex = position;
    const match = partPattern.exec(text);
    if (!match) return null;

    const unit = units.indexOf(match[2].toLowerCase());
    if (unit <= previousUnit) return null;

    total += Number(match[1]) * multipliers[unit];
    if (!Number.isFinite(total)) return null;

    previousUnit = unit;
    position = partPattern.lastIndex;
  }

  return total;
}

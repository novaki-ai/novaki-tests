function parseDuration(text) {
  if (typeof text !== "string") return null;

  text = text.trim();
  if (!text) return null;

  const number = String.raw`(?:\d+(?:\.\d+)?|\.\d+)`;

  if (new RegExp(`^${number}$`).test(text)) {
    const seconds = Number(text);
    return Number.isFinite(seconds) ? seconds : null;
  }

  const pattern = new RegExp(`\\s*(${number})([dhms])`, "iy");
  const units = "dhms";
  const multipliers = [86400, 3600, 60, 1];
  let total = 0;
  let position = 0;
  let previousUnit = -1;

  while (position < text.length) {
    pattern.lastIndex = position;
    const match = pattern.exec(text);
    if (!match) return null;

    const unit = units.indexOf(match[2].toLowerCase());
    if (unit <= previousUnit) return null;

    total += Number(match[1]) * multipliers[unit];
    if (!Number.isFinite(total)) return null;

    previousUnit = unit;
    position = pattern.lastIndex;
  }

  return total;
}

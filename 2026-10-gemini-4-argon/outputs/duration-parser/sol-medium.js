function parseDuration(text) {
  if (typeof text !== "string") return null;

  text = text.trim();
  if (!text) return null;

  const numberPattern = /^(?:\d+(?:\.\d+)?|\.\d+)$/;
  if (numberPattern.test(text)) {
    const seconds = Number(text);
    return Number.isFinite(seconds) ? seconds : null;
  }

  const parts = /(\d+(?:\.\d+)?|\.\d+)([dhms])\s*/iy;
  const units = {
    d: { rank: 4, seconds: 86400 },
    h: { rank: 3, seconds: 3600 },
    m: { rank: 2, seconds: 60 },
    s: { rank: 1, seconds: 1 }
  };

  let position = 0;
  let previousRank = 5;
  let total = 0;

  while (position < text.length) {
    parts.lastIndex = position;
    const match = parts.exec(text);
    if (!match) return null;

    const unit = units[match[2].toLowerCase()];
    if (unit.rank >= previousRank) return null;

    total += Number(match[1]) * unit.seconds;
    if (!Number.isFinite(total)) return null;

    previousRank = unit.rank;
    position = parts.lastIndex;
  }

  return total;
}

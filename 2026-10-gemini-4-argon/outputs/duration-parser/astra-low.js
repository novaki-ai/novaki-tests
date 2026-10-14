function parseDuration(text) {
  if (typeof text !== "string") return null;

  text = text.trim();
  if (!text) return null;

  const number = /^(?:\d+(?:\.\d+)?|\.\d+)$/;
  if (number.test(text)) {
    const seconds = Number(text);
    return Number.isFinite(seconds) ? seconds : null;
  }

  const parts = /\s*(\d+(?:\.\d+)?|\.\d+)([dhms])/iy;
  const units = {
    d: { rank: 0, seconds: 86400 },
    h: { rank: 1, seconds: 3600 },
    m: { rank: 2, seconds: 60 },
    s: { rank: 3, seconds: 1 }
  };

  let total = 0;
  let position = 0;
  let previousRank = -1;

  while (position < text.length) {
    parts.lastIndex = position;
    const match = parts.exec(text);
    if (!match) return null;

    const unit = units[match[2].toLowerCase()];
    if (unit.rank <= previousRank) return null;

    total += Number(match[1]) * unit.seconds;
    previousRank = unit.rank;
    position = parts.lastIndex;
  }

  return Number.isFinite(total) ? total : null;
}

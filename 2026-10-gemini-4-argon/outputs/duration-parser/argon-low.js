function parseDuration(text) {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed)) {
    const val = Number(trimmed);
    return Number.isFinite(val) ? val : null;
  }

  const match = /^(?:(\d+(?:\.\d+)?|\.\d+)\s*d)?\s*(?:(\d+(?:\.\d+)?|\.\d+)\s*h)?\s*(?:(\d+(?:\.\d+)?|\.\d+)\s*m)?\s*(?:(\d+(?:\.\d+)?|\.\d+)\s*s)?$/i.exec(trimmed);
  if (!match) return null;

  const [, d, h, m, s] = match;
  if (d === undefined && h === undefined && m === undefined && s === undefined) {
    return null;
  }

  const total =
    (d ? Number(d) * 86400 : 0) +
    (h ? Number(h) * 3600 : 0) +
    (m ? Number(m) * 60 : 0) +
    (s ? Number(s) : 0);

  return Number.isFinite(total) ? total : null;
}

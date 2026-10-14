function parseDuration(text) {
  if (typeof text !== 'string') return null;

  const trimmed = text.trim();
  if (!trimmed) return null;

  if (/^\d+(?:\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  const match = /^(?:(\d+(?:\.\d+)?)d)?\s*(?:(\d+(?:\.\d+)?)h)?\s*(?:(\d+(?:\.\d+)?)m)?\s*(?:(\d+(?:\.\d+)?)s)?$/i.exec(trimmed);
  if (!match) return null;

  const [, d, h, m, s] = match;
  if (d === undefined && h === undefined && m === undefined && s === undefined) {
    return null;
  }

  return (
    (d ? Number(d) * 86400 : 0) +
    (h ? Number(h) * 3600 : 0) +
    (m ? Number(m) * 60 : 0) +
    (s ? Number(s) : 0)
  );
}

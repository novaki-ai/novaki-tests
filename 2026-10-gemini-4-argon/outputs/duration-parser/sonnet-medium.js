function parseDuration(text) {
  if (typeof text !== 'string') return null;
  const s = text.trim().toLowerCase();
  if (s === '') return null;

  const num = '(\\d+(?:\\.\\d+)?|\\.\\d+)';

  // Plain number means seconds
  if (new RegExp('^' + num + '$').test(s)) {
    const v = Number(s);
    return Number.isFinite(v) ? v : null;
  }

  const re = new RegExp(
    '^(?:' + num + 'd)?\\s*(?:' + num + 'h)?\\s*(?:' + num + 'm)?\\s*(?:' + num + 's)?$'
  );
  const match = re.exec(s);
  if (!match) return null;

  const [, d, h, m, sec] = match;
  if (d === undefined && h === undefined && m === undefined && sec === undefined) return null;

  const total =
    (d !== undefined ? Number(d) * 86400 : 0) +
    (h !== undefined ? Number(h) * 3600 : 0) +
    (m !== undefined ? Number(m) * 60 : 0) +
    (sec !== undefined ? Number(sec) : 0);

  return Number.isFinite(total) ? total : null;
}

function parseDuration(text) {
  if (typeof text !== 'string') return null;
  const input = text.trim();
  if (input === '') return null;

  const num = '(\\d+(?:\\.\\d+)?|\\.\\d+)';

  if (new RegExp(`^${num}$`).test(input)) {
    const value = Number(input);
    return Number.isFinite(value) ? value : null;
  }

  const pattern = new RegExp(
    `^(?:${num}d)?\\s*(?:${num}h)?\\s*(?:${num}m)?\\s*(?:${num}s)?$`,
    'i'
  );
  const match = input.match(pattern);
  if (!match) return null;

  const [, d, h, m, s] = match;
  if (d === undefined && h === undefined && m === undefined && s === undefined) {
    return null;
  }

  const total =
    (d !== undefined ? Number(d) * 86400 : 0) +
    (h !== undefined ? Number(h) * 3600 : 0) +
    (m !== undefined ? Number(m) * 60 : 0) +
    (s !== undefined ? Number(s) : 0);

  return Number.isFinite(total) ? total : null;
}

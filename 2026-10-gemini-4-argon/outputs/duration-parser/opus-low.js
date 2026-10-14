function parseDuration(text) {
  if (typeof text !== 'string') return null;
  const s = text.trim();
  if (s === '') return null;

  const num = '(\\d+(?:\\.\\d+)?|\\.\\d+)';

  const plain = new RegExp('^' + num + '$').exec(s);
  if (plain) return Number(plain[1]);

  const re = new RegExp(
    '^(?:' + num + 'd)?\\s*(?:' + num + 'h)?\\s*(?:' + num + 'm)?\\s*(?:' + num + 's)?$',
    'i'
  );
  const m = re.exec(s);
  if (!m) return null;

  const [, d, h, min, sec] = m;
  if (d === undefined && h === undefined && min === undefined && sec === undefined) {
    return null;
  }

  return (
    (d !== undefined ? Number(d) * 86400 : 0) +
    (h !== undefined ? Number(h) * 3600 : 0) +
    (min !== undefined ? Number(min) * 60 : 0) +
    (sec !== undefined ? Number(sec) : 0)
  );
}

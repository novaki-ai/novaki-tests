function parseDuration(text) {
  if (typeof text !== 'string') return null;
  const s = text.trim().toLowerCase();
  if (!s) return null;

  const num = '(\\d+(?:\\.\\d+)?)';

  if (new RegExp(`^${num}$`).test(s)) {
    const v = Number(s);
    return Number.isFinite(v) ? v : null;
  }

  const match = new RegExp(
    `^(?:${num}d)?\\s*(?:${num}h)?\\s*(?:${num}m)?\\s*(?:${num}s)?$`
  ).exec(s);
  if (!match) return null;

  const multipliers = [86400, 3600, 60, 1];
  let total = 0;
  let found = false;
  for (let i = 0; i < multipliers.length; i++) {
    const part = match[i + 1];
    if (part !== undefined) {
      total += Number(part) * multipliers[i];
      found = true;
    }
  }

  return found && Number.isFinite(total) ? total : null;
}

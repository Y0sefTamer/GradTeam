export function formatContactLink(link: string): string {
  if (!link) return '#';
  const clean = link.trim();
  
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('wa.me/')) {
    return `https://${clean}`;
  }
  if (clean.startsWith('t.me/')) {
    return `https://${clean}`;
  }
  // WhatsApp phone format: digits only (length 8-15)
  if (/^\+?[0-9]{8,15}$/.test(clean)) {
    return `https://wa.me/${clean.replace('+', '')}`;
  }
  // Telegram username format: starts with @
  if (clean.startsWith('@')) {
    return `https://t.me/${clean.slice(1)}`;
  }
  
  // Return as-is or prefix with https:// if it looks like a domain, else let browser handle
  if (clean.includes('.') && !clean.includes(' ')) {
    return `https://${clean}`;
  }
  return `https://wa.me/${clean}`;
}

import net from 'node:net';

/**
 * Returns true for IP addresses that the server can reach by virtue of its
 * network position (cloud metadata, internal LAN, loopback) and that an
 * external attacker could not reach directly. Used to refuse outbound
 * fetches whose URL resolves to such an address.
 */
export const isPrivateOrReservedIp = (address: string): boolean => {
  if (net.isIPv4(address)) {
    const parts = address.split('.').map(Number);
    const a = parts[0]!;
    const b = parts[1]!;
    const c = parts[2]!;
    if (a === 0) return true;
    if (a === 10) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 0 && c === 0) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true;
    return false;
  }
  if (net.isIPv6(address)) {
    const lower = address.toLowerCase();
    if (lower === '::' || lower === '::1') return true;
    if (lower.startsWith('::ffff:')) {
      const mapped = lower.slice(7);
      if (net.isIPv4(mapped)) return isPrivateOrReservedIp(mapped);
    }
    if (/^fe[89ab][0-9a-f]:/.test(lower)) return true;
    if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true;
    if (lower.startsWith('ff')) return true;
    return false;
  }
  return false;
};

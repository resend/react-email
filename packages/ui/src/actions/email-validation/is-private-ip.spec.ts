import { isPrivateOrReservedIp } from './is-private-ip';

const blocked = [
  '0.0.0.0',
  '0.1.2.3',
  '10.0.0.1',
  '10.255.255.254',
  '100.64.0.1',
  '100.127.255.254',
  '127.0.0.1',
  '127.255.255.254',
  '169.254.169.254',
  '169.254.0.1',
  '172.16.0.1',
  '172.31.255.254',
  '192.0.0.0',
  '192.168.0.1',
  '192.168.1.1',
  '224.0.0.1',
  '239.255.255.255',
  '255.255.255.255',
  '::',
  '::1',
  '::ffff:127.0.0.1',
  '::ffff:10.0.0.1',
  '::ffff:169.254.169.254',
  'fe80::1',
  'fe80::abcd:1234',
  'fc00::1',
  'fd00::1',
  'ff02::1',
];

const allowed = [
  '1.1.1.1',
  '8.8.8.8',
  '93.184.216.34',
  '172.15.255.254',
  '172.32.0.1',
  '100.63.255.254',
  '100.128.0.1',
  '169.253.255.254',
  '169.255.0.1',
  '192.0.1.1',
  '192.169.0.1',
  '223.255.255.254',
  '2606:4700:4700::1111',
  '2001:4860:4860::8888',
  '::ffff:1.1.1.1',
];

const malformed = ['', 'not-an-ip', '999.999.999.999', 'example.com'];

test.each(blocked)('blocks %s', (address) => {
  expect(isPrivateOrReservedIp(address)).toBe(true);
});

test.each(allowed)('allows %s', (address) => {
  expect(isPrivateOrReservedIp(address)).toBe(false);
});

test.each(malformed)('returns false for non-IP input %s', (address) => {
  expect(isPrivateOrReservedIp(address)).toBe(false);
});

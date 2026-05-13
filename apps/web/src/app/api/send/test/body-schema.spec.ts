import { bodySchema } from './route';

describe('send test body schema', () => {
    test('accepts a valid payload', () => {
        expect(
            bodySchema.safeParse({
                to: 'user@example.com',
                subject: 'Hello there',
                html: '<p>Hello</p>',
            }).success,
        ).toBe(true);
    });

    test('rejects invalid email addresses', () => {
        expect(
            bodySchema.safeParse({
                to: 'not-an-email',
                subject: 'Hello there',
                html: '<p>Hello</p>',
            }).success,
        ).toBe(false);
    });

    test('rejects overlong subjects and html', () => {
        expect(
            bodySchema.safeParse({
                to: 'user@example.com',
                subject: 'a'.repeat(201),
                html: '<p>' + 'a'.repeat(100_001) + '</p>',
            }).success,
        ).toBe(false);
    });
});
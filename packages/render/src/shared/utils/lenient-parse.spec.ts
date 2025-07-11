import { lenientParse } from './lenient-parse';

describe('lenientParse()', () => {
  it('should parse base doucment correctly', () => {
    const document = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head></head><body style="background-color:#fff;"><h1>whatever</h1><input placeholder="hello world"/></body></html>`;
    expect(lenientParse(document)).toMatchSnapshot();
  });
});

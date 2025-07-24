import { handleRelevantEmailClientIssues } from './handle-relevant-email-client-issues';

describe('handleRelevantEmailClientIssues', () => {
  // This is necessary because some click trackning mechanisms break when trying to the links with HTML entities with their own
  //
  // See https://github.com/resend/react-email/issues/1767#issuecomment-2747680180
  it('should decode href attributes with single quotes', () => {
    const input = `<a href='https://example.com/?utm_source=mailchimp&amp;utm_medium=email&amp;utm_campaign=example'>Click here</a><a href="https://example.com/?utm_source=mailchimp&amp;utm_medium=email&amp;utm_campaign=example">Click here</a>`;
    expect(handleRelevantEmailClientIssues(input)).toMatchSnapshot('');
  });
});

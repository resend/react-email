import fs from 'node:fs';

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) {
  throw new Error(
    'GITHUB_EVENT_PATH environment variable is not set. This script is only meant to run in during a Github workflow.',
  );
}

const eventJson = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const { title } = eventJson.pull_request;

const validTypeRegex =
  /^(feat|fix|chore|refactor)(\([a-zA-Z0-9-]+\))?:\s[a-z].*$/;

if (!validTypeRegex.test(title)) {
  console.error(
    `pull request title does not follow the required format.
example: "type: description of the change"

- type: "feat", "fix", "chore", or "refactor"
- first letter of the title after the 'type' needs to be lowercased`,
  );
  process.exit(1);
}

console.info('pull request title is valid');

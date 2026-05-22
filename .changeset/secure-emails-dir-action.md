---
"@react-email/ui": patch
---

stop accepting the emails directory path as a server-action argument

The `getEmailsDirectoryMetadataAction` server action used to take an
absolute filesystem path from the client and walk that directory on the
server, which allowed any caller of the endpoint to enumerate arbitrary
directories on the host. The action now reads the path from the server-only
`REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH` env variable and ignores
client input.

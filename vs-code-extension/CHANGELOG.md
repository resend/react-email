# Change Log

All notable changes to the "react-email-preview" extension will be documented in this file.

## 0.0.3 - 2024-27-01

### Features

- Update building mechanism to not create temporary javascript files
- Upgrade esbuild to not need a `tsconfig`, meaning aliases and other things should now work properly

## 0.0.2 - 2023-11-04

### Features

- Update the display name to "React Email"

### Fixes

- OS issues with esbuild

## 0.0.1 - 2023-11-04

### Fixes

- Fixed build files not being deleted for files that are not email templates

## 0.0.0 - 2023-11-04

Released first version for testing.

### Features

- Command (`CTRL + SHIFT + E` or `CMD + SHIFT + E`) for opening split for preview
- Preview updates on file save
- When changing files the preview updates
- Multiple previews can't be open

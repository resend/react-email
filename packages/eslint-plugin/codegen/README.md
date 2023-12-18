## What is this?

This is a folder used to generate the eslint rules based on the metadata on the markdown 
for each specific possible feature of email templates.

> [!NOTE]
> The codegen for the eslint plugin wouldn't work without the work of the guys
> at [caniemail](https://github.com/hteumeuleu/caniemail) so go ahead give them a star!

## How can I run this?

### 1. Clone caniemail 

Before you run, you might have cloned the React Email repository without the 
caniemail submodule here so you will need to run:

```sh
git submodule update --init --recursive
```

### 2. Run with pnpm script

```sh
pnpm generate-rules
```

## What is this `manual-changes.patch`?

Every time the codegen runs it will try to generate the rules based on guesses of 
what type of rule they are supposed to be. Lots of times this guess will fail
and this is the way we are currently using to apply the changes and keep track
of them in a good way.

### How to modify manual changes

Currently the way we are using for modifying it is to open it up manually and add
the changes we need to the `manual-changes.patch` this may not be the best way
for changing it so if you have any better ideas about this please open a issue, PR or discussion
for us to talk about it.    


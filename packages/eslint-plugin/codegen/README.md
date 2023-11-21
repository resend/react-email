This is a folder used to generate the eslint rules based on the metadata on the markdown 
for each specific possible feature of email templates.

Every time this is ran it will generate exports and other things for the rules
and override the existing ones (except for ones that are not generated). Be aware
that some rules must be modified to work properly since certain caniemail documented
feature support are for multiple features for one single markdown file.

For ease of modifying the rules in a easier way, we save a `manual-changes.patch` file
that you can apply with `git apply manual-changes.patch` and then modify what needs
to be modified after codegen.

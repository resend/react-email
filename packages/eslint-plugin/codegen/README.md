This is a folder used to generate the eslint rules based on the metadata on the markdown 
for each specific possible feature of email templates.

Every time this is ran it will generate exports and other things for the rules
and override the existing ones (except for ones that are not generated). Be aware
that some rules must be modified to work properly since certain caniemail documented
feature support are for multiple features for one single markdown file.

Here is a small table that can be helpfull to change the generated rule files:

| rule to change              | change necessary                                                                    |
|-----------------------------|-------------------------------------------------------------------------------------|
| no-column-layout-properties | add all column layout properties                                                    |
| no-conic-gradient           | convert into using `createNoStyleValueKeywordRule`                                           |
| no-function-clamp           | convert into using `createNoStyleValueKeywordRule` and adjust the keyword to `clamp(`        |
| no-function-max             | convert into using `createNoStyleValueKeywordRule` and adjust the keyword to `max(`          |
| no-function-min             | convert into using `createNoStyleValueKeywordRule` and adjust the keyword to `min(`          |
| no-grid-template            | add all grid template properties as well as `grid-template` itself                  |
| no-important                | add missing `!` prefix on the property name                                         |
| no-inline-size              | delete in favor of matching the value instead of the property                       |
| no-margin-block-start-end   | add the two properties margin-block-start and margin-block-end                      |
| no-margin-inline-block      | add the two properties margin-inline and margin-block                               |
| no-margin-inline-start-end  | add the two properties margin-inline-end and margin-inline-start                    |
| no-margin-inline            | delete in favor of the margin-inline-block rule that also inlcudes this prop        |
| no-modern-color             | substitute to match the values of properties that include ich, oklch, lab and oklab |
| no-padding-block-start-end  | add the two properties padding-block-start and padding-block-end                    |
| no-padding-inline-block     | add the two properties padding-inline and padding-block                             |
| no-padding-inline-start-end | add the two properties padding-inline-start and padding-inline-end                  |
| no-nesting                  | substitute property to be scroll-snap-type                                          |
| no-scroll-snap              | delete since we are not going to match <style> tags                                 |
| no-selector-attribute       | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-checked     | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-focus       | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-lang        | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-not         | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-nth-cild    | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-nth-last-child   | delete since we are not going to match <style> tags                            |
| no-pseudo-class-nth-last-of-type | delete since we are not going to match <style> tags                            |
| no-pseudo-class-nth-of-type | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-target      | delete since we are not going to match <style> tags                                 |
| no-pseudo-class-visited     | delete since we are not going to match <style> tags                                 |
| no-pseudo-element-after     | delete since we are not going to match <style> tags                                 |
| no-pseudo-element-before    | delete since we are not going to match <style> tags                                 |
| no-pseudo-element-placeholder | delete since we are not going to match <style> tags                                 |


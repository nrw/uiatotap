# uiatotap

A filter that turns UIAutomation output into TAP output

## Install

```bash
npm install -g uiatotap
```

## Example

With a `runtests.sh` file containing something like this

```bash
#!/usr/bin/env bash

instruments -w "<deviceid>" -t "<template path>" "path/to/My.app" -e UIASCRIPT "./uiautomation.js" -e UIARESULTSPATH "./output"
```

Pipe the output through `uiatotap`

```bash
./runtests.sh | uiatotap
```

Outputs

```tap
TAP version 13
# Add Single Template
ok 1 correct title
ok 2 correct duration display
not ok 3 correct Fade In display
ok 4 correct Fade Out display
ok 5 did add template item

1..5
# tests 5
# pass  4

# fail  1
```

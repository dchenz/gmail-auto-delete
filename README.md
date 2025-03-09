# Gmail Auto Delete

This is a Google Apps Script that automatically moves emails to Trash based on retention policy labels.

## Usage

Copy and paste `Code.js` into the editor of the Apps Script project.

Register a trigger to run the `main` function once a day.

In Gmail, labels can be applied to incoming or existing emails using builtin filters. The label name should be formatted like `prune-1d`, `prune-1m` or `prune-1y`.

## Development

Node version: v20.16.0

Refer to the [Clasp documentation](https://developers.google.com/apps-script/guides/clasp).

Add `.clasp.json` in the project root. The script ID is located in the settings of your Apps Script project.

```json
{ "scriptId": "SCRIPT_ID", "rootDir": "LOCAL_PROJECT_DIR" }
```

```sh
# Build Code.js (Apps Script can't run typescript in *.gs files)
yarn build

# Upload `Code.js` to Apps Scripts
clasp deploy

# Run unit tests
yarn test
```

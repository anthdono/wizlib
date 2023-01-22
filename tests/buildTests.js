const { exec } = require("child_process");

exec(`rm -rf ./dist &&
      rm -rf ./tests/*.tgz &&
      rm -rf ./tests/node_modules &&
      npm run build &&
      mkdir tests/node_modules &&
      mkdir tests/node_modules/wizlib &&
      cp -r dist tests/node_modules/wizlib/ &&
      cp package.json tests/node_modules/wizlib &&
      cp README.md tests/node_modules/wizlib
`);

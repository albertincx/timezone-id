require('fs')
    .readdirSync(__dirname)
    .filter(i => i.match(/^test-/))
    .forEach(i => require(`./${i}`));

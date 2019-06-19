const chalk = require('chalk');

const log = (...messages) => console.log(...messages);
log.red = (...messages) => console.log(chalk.red(...messages));
log.blue = (...messages) => console.log(chalk.blue(...messages));
log.green = (...messages) => console.log(chalk.green(...messages));
log.yellow = (...messages) => console.log(chalk.yellow(...messages));

module.exports = log;

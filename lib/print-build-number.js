var chalk = require('chalk');


module.exports.printBuildNumber = function(isInstalled, buildNumber) {
  if (isInstalled) {
    return console.log(
      ' ◉',
      chalk.green(buildNumber)
    );
  }

  console.log(
    ' ◯',
    buildNumber
  );
};
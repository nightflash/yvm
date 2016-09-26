module.exports.printBuildNumber = function(isInstalled, buildNumber) {
  console.log(
    (isInstalled ? ' ◉' : ' ◯'),
    buildNumber
  );
};
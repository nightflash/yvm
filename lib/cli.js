#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2), {
  '--': true
});

var hostname = 'http://buildserver.labs.intellij.net';
var buildTypeId = 'YTDEV_BuildArtifactsJarAndWarGradle';

var config = require('./config').createConfig({
  hostname: argv['hostname'] || hostname,
  buildTypeId: argv['build-type-id'] || buildTypeId
});


switch (argv._[0]) {
  case 'ls':
    require('./ls')(config).print();
    break;


  case 'ls-remote':
    require('./ls-remote')(config.create({
      count: argv['count'],
      markInstalled: true
    }));
    break;


  case 'install':
    require('./install-remote')(config.create({
      progress: true,
      save: true,
      buildNumber: argv._[1]
    }));
    break;


  case 'run':
    require('./run')(config)(argv._[1], argv);
    break;


  case 'run-remote':
    require('./run-remote')(config)(argv._[1], argv);
    break;


  case 'rm':
    require('./rm')(config)(argv._[1]);
    break;


  case 'home':
    console.log(config.rootDir);
    break;

  default:
    if (argv['version']) {
      console.log(require('../package.json').version);
      return;
    }

    printHelp();
}


function printHelp() {
  br();
  printTitle('Usage');
  printLine('install <build>                                    ', 'Download and install a <build> of YouTrack');
  printLine('rm <build>                                         ', 'Remove a <build>');
  printLine('ls                                                 ', 'List installed builds');
  printLine('ls-remote [--count=10]                             ', 'List remote builds available for install');
  printLine('run <build> [--port | -p] [--host | -h] [--context]', 'Run <build> on [host], [port] and [context]');
  printLine('                                                   ', 'You can specify java parameters after `--`');
  printLine('run-remote <build>                                 ', 'Download <build> and run without saving on local machine');
  printLine('home                                               ', 'Print yvm home directory where stored builds');
  br();

  function printTitle(title) {
    console.log('  ' + title + ':');
  }

  function br() {
    console.log('');
  }

  function printLine(option, description) {
    console.log('    ' + option + '   ' + description);
  }
}

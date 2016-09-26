var path = require('path');


module.exports = function(config, createProcessRun) {
  createProcessRun = createProcessRun || createProcessRunDefault;


  return function(buildNumber, options) {
    buildNumber = String(buildNumber);
    options = options || {};

    var runPrc = createProcessRun();

    var javaArgs = [
      '-Xmx1g',
      '-XX:PermSize=256m',
      '-XX:MaxPermSize=256m',
      '-Djetbrains.youtrack.disableBrowser=true',
      '-Djetbrains.charisma.suckTheTractorDriversDick=true'
    ];
    var userJavaArgs = options['--'] || [];

    var jarName = 'youtrack-' + buildNumber + '.jar';
    var jarPath = path.resolve(config.rootDir, buildNumber, jarName);

    var host = options['host'] || options['h'] || 'http://127.0.0.1';
    var port = options['port'] || options['p'] || '8088';
    var context = options['context'] || '';
    var baseUrl = host + ':' + port;

    if (options.d || options.dry) {
      javaArgs.push(
        '-Duser.home=' + '/tmp/' + buildNumber + '_' + Date.now()
      );
    }

    if (context) {
      baseUrl += '/' + context;
    }

    var serverArgs = [
      '-Djetbrains.youtrack.baseUrl=' + baseUrl
    ];

    var prc = runPrc('java', []
      .concat(javaArgs)
      .concat(userJavaArgs)
      .concat(serverArgs)
      .concat([
        '-jar',
        jarPath
      ])
      .concat([
        context ? port + '/' + context : port
      ])
    );

    prc.stdout.on('data', (data) => {
      console.log(String(data));
    });

    prc.stderr.on('data', (data) => {
      console.error(String(data));
    });

    prc.on('error', (err) => {
      console.log('run process failed ', err);
    });

    prc.on('close', (code) => {
      console.log('run process exited with code ' + code);
    });
  }
};


function createProcessRunDefault() {
  return require('child_process').spawn;
}
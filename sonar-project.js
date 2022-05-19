const sonarqubeScanner = require('sonarqube-scanner');
require('dotenv').config();

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      "sonar.login": process.env.SONAR_LOGIN,
      "sonar.password": process.env.SONAR_PASSWORD,
      'sonar.sources': './',
      'sonar.tests': './tests',
      'sonar.language': 'js',
      'sonar.inclusions': '**', // Entry point of your code
      'sonar.exclusions': '**/tests/*.js',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
      'sonar.sourceEncoding': 'UTF-8'
    },
  },
  () => {}
);

const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl:  'http://localhost:9000',
        options : {
            'sonar.sources':  './',
            'sonar.tests':  './',
            'sonar.inclusions'  :  '**', // Entry point of your code
            'sonar.test.inclusions':  './**/*.spec.js,./**/*.spec.jsx,./**/*.test.js,./**/*.test.jsx',
            'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
            'sonar.testExecutionReportPaths':  'coverage/test-reporter.xml',
            'sonar.projectKey':'FUturo',
            'sonar.login':'bf178918398d6392d3eb58e42fbd3875ae0e576e'
        }
    }, () => {});

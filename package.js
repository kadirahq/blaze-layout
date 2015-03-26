Package.describe({
  summary: 'Layout Manager for Meteor (designed for flow)',
  version: '1.0.2',
  git: 'https://github.com/meteorhacks/flow-layout',
  name: "meteorhacks:flow-layout"
});

Package.onUse(function (api) {
  configure(api);
  api.export(['FlowLayout']);
});

Package.onTest(function(api) {
  configure(api);
  api.use('tinytest');
  api.addFiles('tests/client/init.templates.html', 'client');
  api.addFiles('tests/client/init.templates.js', 'client');
  api.addFiles('tests/client/unit.js', 'client');
  api.addFiles('tests/client/integration.js', 'client');
});

function configure(api) {
  api.versionsFrom('METEOR@0.9.2');
  api.use('ui');
  api.use('templating');
  api.use('reactive-dict');
  api.use('underscore');

  api.addFiles('lib/client/namespace.js', 'client');
  api.addFiles('lib/client/layout.js', 'client');
}

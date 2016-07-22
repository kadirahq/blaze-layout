Package.describe({
  summary: 'Layout Manager for Blaze (works well with FlowRouter)',
  version: '2.3.0',
  git: 'https://github.com/kadirahq/blaze-layout',
  name: "kadira:blaze-layout"
});

Package.onUse(function (api) {
  configure(api);
  api.export(['BlazeLayout']);
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
  api.versionsFrom('1.0');
  api.use('blaze');
  api.use('templating');
  api.use('jagi:reactive-map@2.0.0');
  api.use('underscore');
  api.use('jquery');
  api.use('tracker');

  api.addFiles('lib/client/namespace.js', 'client');
  api.addFiles('lib/client/layout.js', 'client');
}

Tinytest.addAsync("Integration - render to the dom", function(test, done) {
  FlowLayout.reset();
  FlowLayout.render('layout1', {aa: 200});
  Tracker.afterFlush(function() {
    test.isTrue(/200/.test($('#__flow-root').text()));
    Meteor.setTimeout(done, 0);
  });
});

Tinytest.addAsync("Integration - do not re-render", function(test, done) {
  FlowLayout.reset();
  ResetStats('layout1');
  FlowLayout.render('layout1', {aa: 2000});

  Tracker.afterFlush(function() {
    FlowLayout.render('layout1', {aa: 3000});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/3000/.test($('#__flow-root').text()));
    test.equal(TemplateStats.layout1.rendered, 1);
    test.equal(TemplateStats.layout1.destroyed, 0);
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - re-render for the new layout", function(test, done) {
  FlowLayout.reset();
  ResetStats('layout1');
  ResetStats('layout2');

  FlowLayout.render('layout1');

  Tracker.afterFlush(function() {
    FlowLayout.render('layout2', {aa: 899});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/899/.test($('#__flow-root').text()));
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - render the new layout with data", function(test, done) {
  FlowLayout.reset();
  ResetStats('layout1');
  ResetStats('layout2');

  FlowLayout.render('layout1');

  Tracker.afterFlush(function() {
    FlowLayout.render('layout2', {});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/layout2/.test($('#__flow-root').text()));
    test.equal(TemplateStats.layout1.rendered, 1);
    test.equal(TemplateStats.layout1.destroyed, 1);
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - pick new data", function(test, done) {
  FlowLayout.reset();

  FlowLayout.render('layout3', {aa: 10});

  Tracker.afterFlush(function() {
    test.isTrue(/10/.test($('#__flow-root').text()));
    FlowLayout.render('layout3', {aa: 30, bb: 20});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.isTrue(/30/.test($('#__flow-root').text()));
    test.isTrue(/20/.test($('#__flow-root').text()));
    Meteor.setTimeout(done, 0);
  }
});

Tinytest.addAsync("Integration - do not re-render vars again", function(test, done) {
  FlowLayout.reset();

  FlowLayout.render('layout3', {aa: 10, bb: 20});

  Tracker.afterFlush(function() {
    test.isTrue(/10/.test($('#__flow-root').text()));
    test.isTrue(/20/.test($('#__flow-root').text()));
    $('#__flow-root').html('');
    FlowLayout.render('layout3', {aa: 10, bb: 20});
    Tracker.afterFlush(checkStatus);
  });

  function checkStatus() {
    test.equal($('#__flow-root').html(), '');
    Meteor.setTimeout(done, 0);
  }
});
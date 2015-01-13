var currentLayoutName = null;
var currentLayout = null;
var currentRegions = new ReactiveDict;

FlowLayout.render = function render(layout, regions) {
  Meteor.startup(function() {
    var rootDomNode = FlowLayout._getRootDomNode();
    if(currentLayoutName != layout) {
      var data = FlowLayout._regionsToData(regions);

      // remove old view
      FlowLayout.reset();

      currentLayout = Blaze._TemplateWith(data, function() {
        return Spacebars.include(Template[layout]);
      });

      Blaze.render(currentLayout, rootDomNode);
      currentLayoutName = layout;
    } else {
      FlowLayout._updateRegions(regions);
    }
  });
};

FlowLayout.reset = function reset() {
  var rootDomNode = FlowLayout._getRootDomNode();
  if(currentLayout) {
    Blaze._destroyView(currentLayout);
    $(rootDomNode).html('');
    currentLayout = null;
    currentLayoutName = null;
    currentRegions = new ReactiveDict;
  }
};

FlowLayout._regionsToData = function _regionsToData(regions) {
  var data = {};
  _.each(regions, function(value, key) {
    currentRegions.set(key, value);
    data[key] = function() {
      return currentRegions.get(key);
    };
  });

  return data;
};

FlowLayout._updateRegions = function _updateRegions(regions) {
  _.each(regions, function(value, key) {
    currentRegions.set(key, value);
  });
};

FlowLayout._getRootDomNode = function _getRootDomNode() {
  return $('#__flow-root').get(0);
};
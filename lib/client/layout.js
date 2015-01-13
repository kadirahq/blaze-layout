var currentLayoutName = null;
var currentLayout = null;
var currentRegions = new ReactiveDict;

FlowLayout.render = function render(layout, regions) {
  Meteor.startup(function() {
    var rootDomNode = $('#__flow-root').get(0);
    if(currentLayoutName != layout) {
      var data = FlowLayout._regionsToData(regions);

      // remove old view
      if(currentLayout) {
        Blaze._destroyView(currentLayout);
        $(rootDomNode).html('');
      }

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
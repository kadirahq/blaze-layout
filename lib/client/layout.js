var currentLayoutName = null;
var currentLayout = null;
var currentRegions = new ReactiveDict();
var currentData;

FlowLayout.render = function render(layout, regions) {
  Meteor.startup(function() {
    var rootDomNode = FlowLayout._getRootDomNode();
    if(currentLayoutName != layout) {
      // remove old view
      FlowLayout.reset();
      currentData = FlowLayout._regionsToData(regions);

      currentLayout = Blaze._TemplateWith(currentData, function() {
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
    Blaze.remove(currentLayout);
    currentLayout = null;
    currentLayoutName = null;
    currentRegions = new ReactiveDict();
  }
};

FlowLayout._regionsToData = function _regionsToData(regions, data) {
  data = data || {};
  _.each(regions, function(value, key) {
    currentRegions.set(key, value);
    data[key] = FlowLayout._buildRegionGetter(key);
  });

  return data;
};

FlowLayout._updateRegions = function _updateRegions(regions) {
  var needsRerender = false;
  _.each(regions, function(value, key) {
    // if this key does not yet exist then blaze
    // has no idea about this key and it won't get the value of this key
    // so, we need to force a re-render
    if(currentData && currentData[key] === undefined) {
      needsRerender = true;
      // and, add the data function for this new key
      currentData[key] = FlowLayout._buildRegionGetter(key);
    }
    currentRegions.set(key, value);
  });

  // force re-render if we need to
  if(currentLayout && needsRerender) {
    currentLayout.dataVar.dep.changed();
  }
};

FlowLayout._getRootDomNode = function _getRootDomNode() {
  return $('#__flow-root').get(0);
};

FlowLayout._buildRegionGetter = function _buildRegionGetter(key) {
  return function() {
    return currentRegions.get(key);
  };
};

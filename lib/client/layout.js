var currentLayoutName = null;
var currentLayout = null;
var currentRegions = new ReactiveDict();
var currentData;
var _isReady = false;

FlowLayout.setRoot = function(root) {
  FlowLayout._root = root;
};

FlowLayout.render = function render(layout, regions) {
  Meteor.startup(function() {
    // To make sure dom is loaded before we do rendering layout.
    // Related to issue #25
    if(!_isReady) {
      Meteor.defer(function() {
        _isReady = true;
        FlowLayout._render(layout, regions)
      });
    } else {
      FlowLayout._render(layout, regions);
    }
  });
};

FlowLayout.reset = function reset() {
  var layout = currentLayout;
  if(layout) {
    if(layout._domrange) {
      // if it's rendered let's remove it right away
      Blaze.remove(layout);
    } else {
      // if not let's remove it when it rendered
      layout.onViewReady(function() {
        Blaze.remove(layout);
      });
    }

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
  // unset removed regions from the exiting data
  _.each(currentData, function(value, key) {
    if(regions[key] === undefined) {
      currentRegions.set(key, undefined);
      delete currentData[key];
    }
  });

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
  var root = FlowLayout._root
  if(!root) {
    root = $('<div id="__flow-root"></div>');
    $('body').append(root);
    FlowLayout.setRoot(root);
  }

  // We need to use $(root) here because when calling FlowLayout.setRoot(),
  // there won't have any available DOM elements
  // So, we need to defer that.
  var domNode = $(root).get(0);
  if(!domNode) {
    throw new Error("Root element does not exist");
  }

  return domNode;
};

FlowLayout._buildRegionGetter = function _buildRegionGetter(key) {
  return function() {
    return currentRegions.get(key);
  };
};

FlowLayout._render = function _render(layout, regions) {
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
};
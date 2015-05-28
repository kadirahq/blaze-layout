var currentLayoutName = new ReactiveVar();
var currentLayout = null;
var currentRegions = new ReactiveDict();
var initializedWrapper = false;
var currentData;

FlowLayout.setRoot = function(root) {
  FlowLayout._root = root;
};

FlowLayout.render = function render(layout, regions) {
  Meteor.startup(function() {
    var rootDomNode = FlowLayout._getRootDomNode();
    if(currentLayoutName.get() != layout) {
      // remove old view
      FlowLayout.reset();
      // set data for layout
      currentData = FlowLayout._regionsToData(regions);
      // dont use blaze.render here -> do it in the layout

      // set layout name reactivly
      currentLayoutName.set(layout);
    } else {
      FlowLayout._updateRegions(regions);
    }
  });
};

// helpers for the root layout
Template.flowLayoutRoot.helpers({
  layout: function(){
    return currentLayoutName.get();
  },
  currentData: function() {
    return currentData;
  }
});

FlowLayout.reset = function reset() {
  var rootDomNode = FlowLayout._getRootDomNode();
  if(currentLayout) {
    currentLayout = null;
    currentLayoutName = new ReactiveVar();
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
  var root = FlowLayout._root;

  if(!initializedWrapper){
    // only render the container once
    Blaze.render(Template.flowLayoutRoot, $('body').get(0));
    initializedWrapper = true;
  }
  if(!root) {
    // use standard flow-router root node
    root = $('#__flow-root');
    FlowLayout.setRoot(root);
  }else{
    // use custom root node
    root = $(root);
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

var currentLayoutName = null;
var currentLayout = null;
var currentRegions = new ReactiveDict();
var currentData;
var _isReady = false;

BlazeLayout.setRoot = function(root) {
  BlazeLayout._root = root;
};

BlazeLayout.render = function render(layout, regions) {
  regions = regions || {};
  Meteor.startup(function() {
    // To make sure dom is loaded before we do rendering layout.
    // Related to issue #25
    if(!_isReady) {
      Meteor.defer(function() {
        _isReady = true;
        BlazeLayout._render(layout, regions)
      });
    } else {
      BlazeLayout._render(layout, regions);
    }
  });
};

BlazeLayout.wrapRender = function(layout){
  return function(regions){
    return BlazeLayout.render(layout, regions);
  }
}

BlazeLayout.reset = function reset() {
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

BlazeLayout._regionsToData = function _regionsToData(regions, data) {
  data = data || {};
  _.each(regions, function(value, key) {
    currentRegions.set(key, value);
    data[key] = BlazeLayout._buildRegionGetter(key);
  });

  return data;
};

BlazeLayout._updateRegions = function _updateRegions(regions) {
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
      currentData[key] = BlazeLayout._buildRegionGetter(key);
    }
    currentRegions.set(key, value);
  });

  // force re-render if we need to
  if(currentLayout && needsRerender) {
    currentLayout.dataVar.dep.changed();
  }
};

BlazeLayout._getRootDomNode = function _getRootDomNode() {
  var root = BlazeLayout._root
  if(!root) {
    root = Blaze._DOMBackend.parseHTML('<div id="__blaze-root"></div>')[0];
    document.body.appendChild(root);
    BlazeLayout.setRoot(root);
  } else if (typeof root === 'string') {
    root = Blaze._DOMBackend.findBySelector(root, document)[0];
  } else if (root.jquery) {
    root = root[0];
  }

  if(!root) {
    throw new Error("Root element does not exist");
  }

  return root;
};

BlazeLayout._buildRegionGetter = function _buildRegionGetter(key) {
  return function() {
    return currentRegions.get(key);
  };
};

BlazeLayout._getTemplate = function (layout, rootDomNode) {
  if (Blaze._getTemplate) {
    // if Meteor 1.2, see https://github.com/meteor/meteor/pull/4036
    // using Blaze._getTemplate instead of directly accessing Template allows
    // packages like Blaze Components to hook into the process
    return Blaze._getTemplate(layout, function () {
      var view = Blaze.getView(rootDomNode);
      // find the closest view with a template instance
      while (view && !view._templateInstance) {
        view = view.originalParentView || view.parentView;
      }
      // return found template instance, or null
      return (view && view._templateInstance) || null;
    });
  }
  else {
    return Template[layout];
  }
};

BlazeLayout._render = function _render(layout, regions) {
  var rootDomNode = BlazeLayout._getRootDomNode();
  if(currentLayoutName != layout) {
    // remove old view
    BlazeLayout.reset();
    currentData = BlazeLayout._regionsToData(regions);

    currentLayout = Blaze._TemplateWith(currentData, function() {
      var template = BlazeLayout._getTemplate(layout, rootDomNode);

      // 'layout' should be null (to render nothing) or an existing template name
      if (layout !== null && !template)
        console.log('BlazeLayout warning: unknown template "' + layout + '"');

      return Spacebars.include(template);
    });

    Blaze.render(currentLayout, rootDomNode, null, Blaze.getView(rootDomNode));
    currentLayoutName = layout;
  } else {
    BlazeLayout._updateRegions(regions);
  }
};

TemplateStats = {};

ResetStats = function ResetStats(layoutName) {
  TemplateStats[layoutName] = {
    rendered: 0,
    destroyed: 0
  };
}

ResetStats('layout1');

Template.layout1.rendered = function() {
  TemplateStats.layout1.rendered++;
};

Template.layout1.destroyed = function() {
  TemplateStats.layout1.destroyed++;
};

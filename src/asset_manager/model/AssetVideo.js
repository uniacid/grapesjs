var Backbone = require('backbone');
var Asset = require('./Asset');

module.exports = Asset.extend({

  defaults: _.extend({}, Asset.prototype.defaults, {
    type:     'video',
    unitDim:  'px',
    height:    0,
    width:    0,
  }),

});

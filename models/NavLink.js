var keystone = require('keystone');
var Types = keystone.Field.Types;


var NavLink = new keystone.List('NavLink');

NavLink.add({
  name: {type: String, required: true},
  url: {type: Types.Url, required: true, initial: true},
  order: {type: Number, default: 0},
});

NavLink.defaultColumns = 'name, url';
NavLink.register();


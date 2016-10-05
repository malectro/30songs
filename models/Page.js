var keystone = require('keystone');
var Types = keystone.Field.Types;


var Page = new keystone.List('Page', {
  map: {name: 'title'},
  autokey: {path: 'slug', from: 'slug', unique: true},
});

Page.add({
  title: {type: String, required: true},
  slug: {type: String, required: true, initial: true},
  description: {type: Types.Textarea, height: 100, note: 'Description is totally optional. Only necessary for the About page.'},
  content: {type: Types.Markdown, height: 200},
});

Page.defaultColumns = 'title, slug';
Page.register();


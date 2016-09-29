var keystone = require('keystone');
var Types = keystone.Field.Types;


var Song = new keystone.List('Song', {
  map: {name: 'title'},
  autokey: {path: 'slug', from: 'number', unique: true},
});

Song.add({
  title: {type: String, required: true},
  number: {type: Number, required: true, initial: true},
  artist: {type: String, required: true, initial: true},
  image: {
    type: Types.S3File,
    allowedTypes: ['image/png', 'image/jpeg', 'image/gif'],
    showAsImage: true,
  },
  bio: {type: Types.Textarea},
  quote: {type: Types.Textarea},
  lyrics: {type: Types.Textarea},
  state: {type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true},
});

Song.defaultColumns = 'number, title, artist';
Song.register();


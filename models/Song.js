var url = require('url');
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
  youtubeUrl: {type: Types.Url},
  youtubeId: {type: String, watch: 'youtubeUrl', noedit: true, value: function () {
    const youtubeUrl = url.parse(this.youtubeUrl, true);
    return youtubeUrl.query.v;
  }},
  spotifyUrl: {type: String},
  gamePath: {type: String},
  image: {
    type: Types.S3File,
    allowedTypes: ['image/png', 'image/jpeg', 'image/gif'],
    showAsImage: true,
  },
  cropImage: {type: Boolean, label: 'Crop image into a circle.', default: true},
  bio: {type: Types.Markdown, toolbarOptions: {hiddenButtons: 'H1,H2,H3,H4,Code,Image,Quote,List'}},
  quote: {type: Types.Markdown, toolbarOptions: {hiddenButtons: 'H1,H2,H3,H4,Code,Image,Quote,List'}},
  lyrics: {type: Types.Textarea},
  state: {type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true},
});

Song.defaultColumns = 'number, title, artist';
Song.register();


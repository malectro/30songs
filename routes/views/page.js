var cache = require('memory-cache');
var keystone = require('keystone');


function getPage(slug) {
  return new Promise((resolve, reject) => {
    const page = cache.get(slug);

    if (page) {
      return resolve(page);
    }

    keystone.list('Page').model.findOne({
      slug,
    }).exec().then(page => {
      if (!page) {
        reject();
      }
      cache.put(slug, page, 1000);
      resolve(page);
    }, error => reject);
  });
}

exports = module.exports = function (req, res, next) {
	var locals = res.locals;
	var view = new keystone.View(req, res);

  getPage(req.params.slug).then(page => {
    locals.page = page;
    view.render('page');
  }).catch(next);
};


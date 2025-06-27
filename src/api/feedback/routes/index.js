'use strict';

const customRoutes = require('./custom-feedback');

module.exports = {
  routes: [...customRoutes.routes],
};

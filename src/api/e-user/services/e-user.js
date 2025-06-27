'use strict';

/**
 * e-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::e-user.e-user');

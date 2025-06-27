'use strict';

/**
 * prescription-reminder service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::prescription-reminder.prescription-reminder');

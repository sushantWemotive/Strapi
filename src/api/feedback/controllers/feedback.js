'use strict';

module.exports = {
    async getAllFeedbacks(ctx) {
  try {
    const entries = await strapi.entityService.findMany('api::feedback.feedback', {
      sort: { createdAt: 'DESC' },
    });

    ctx.send({ success: true, data: entries });
  } catch (err) {
    ctx.throw(500, 'Error fetching feedbacks');
  }
},
  async submitFeedback(ctx) {
    try {
      const { user, message, rating } = ctx.request.body;

      if (!user || !message) {
        return ctx.badRequest('User and message are required');
      }

      const entry = await strapi.entityService.create('api::feedback.feedback', {
        data: {
          user,
          message,
          rating,
        },
      });

      ctx.send({ success: true, data: entry });
    } catch (err) {
      ctx.throw(500, 'Error submitting feedback');
    }
  },
};

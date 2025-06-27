module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/feedbacks/submit',
      handler: 'feedback.submitFeedback',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/feedbacks/all',
      handler: 'feedback.getAllFeedbacks',
      config: {
        auth: false,
      },
    },
  ],
};

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/hello',
      handler: 'hello.greet',
      config: {
        auth: false,
      },
    },
  ],
};

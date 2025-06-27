module.exports = {
  async greet(ctx) {
    ctx.body = { message: "Hello from custom API!" };
  },
};

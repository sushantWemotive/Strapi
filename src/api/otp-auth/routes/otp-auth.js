module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/otp/send',
      handler: 'otp-auth.sendOtp',
      config: { auth: false }
    },
    {
      method: 'POST',
      path: '/otp/verify',
      handler: 'otp-auth.verifyOtp',
      config: { auth: false }
    }
  ]
};

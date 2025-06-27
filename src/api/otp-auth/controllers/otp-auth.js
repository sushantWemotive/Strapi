'use strict';

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Temporary in-memory OTP store (use DB/Redis in production)
const otpStore = {};

/**
 * Send OTP to Email
 */
module.exports = {
  async sendOtp(ctx) {
    const { email } = ctx.request.body;

    if (!email) {
      return ctx.badRequest('Email is required');
    }

    // Generate OTP and Expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    //  Store OTP with expiry
    otpStore[email] = { otp, expiresAt };

    // Print OTP in terminal for testing
    console.log(`🔑 Generated OTP for ${email} is: ${otp} (Valid for 5 minutes)`);

    // Configure Nodemailer (Gmail example)..
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', 
        pass: 'your-app-password'        
      }
    });

    // Mail content
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
    };

    // Send Mail
    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 OTP ${otp} sent to ${email}`);
      return ctx.send({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return ctx.internalServerError('Failed to send OTP');
    }
  },

  /**
   * Verify OTP and Issue JWT
   */
  async verifyOtp(ctx) {
    const { email, otp } = ctx.request.body;

    if (!email || !otp) {
      return ctx.badRequest('Email and OTP are required');
    }

    const storedOtpEntry = otpStore[email];

    // Check if OTP exists
    if (!storedOtpEntry) {
      return ctx.badRequest('No OTP requested for this email');
    }

    const { otp: storedOtp, expiresAt } = storedOtpEntry;

    // Check OTP expiry
    if (Date.now() > expiresAt) {
      delete otpStore[email]; // Remove expired OTP
      return ctx.unauthorized('OTP has expired');
    }

    // Compare OTPs
    if (storedOtp !== otp) {
      return ctx.unauthorized('Invalid OTP');
    }

    // OTP verified - clean up
    delete otpStore[email];

    // Check if user exists or create new user
    let user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email }
    });

    if (!user) {
      user = await strapi.query('plugin::users-permissions.user').create({
        data: {
          username: email,
          email,
          password: crypto.randomBytes(10).toString('hex')
        }
      });
    }

    // ✅ Issue JWT token
    const token = strapi.plugin('users-permissions').service('jwt').issue({
      id: user.id
    });

    return ctx.send({
      jwt: token,
      user
    });
  }
};

const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const User = require('../models/User.js');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const genericSuccessResponse = { 
      message: "If that email exists, a reset link has been sent." 
    };

    if (!email) {
      return res.status(200).json(genericSuccessResponse);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      user.resetTokenHash = tokenHash;
      user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
            await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Onboarding <onboarding@resend.dev>',
        to: [normalizedEmail],
        subject: 'Reset Your Password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h2 style="color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 8px; margin-top: 0;">Reset your password</h2>
            <p style="color: #6B7280; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">You requested a password reset for your account. Click the button below to set a new password. This link is valid for 1 hour.</p>
            <div style="margin: 28px 0;">
              <a href="${resetLink}" style="background-color: #7C3AED; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #6B7280; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;" />
            <p style="color: #6B7280; font-size: 12px; margin-bottom: 4px;">If the button doesn't work, copy and paste this URL into your browser:</p>
            <p style="color: #7C3AED; font-size: 12px; word-break: break-all; margin-top: 0;">${resetLink}</p>
          </div>
        `
      });
    }

    return res.status(200).json(genericSuccessResponse);
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required." });
    }

    const hashedIncoming = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetTokenHash: hashedIncoming,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired password reset link." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password_hash = hashedPassword;
    user.resetTokenHash = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

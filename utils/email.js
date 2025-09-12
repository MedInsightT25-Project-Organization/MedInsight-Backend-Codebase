const nodemailer = require('nodemailer')
const { logger } = require('./logger')
require('dotenv').config

const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST,
  // port: process.env.SMTP_PORT,
  // secure: false,
  // requireTLS: true,
  // tls: {
  //   rejectUnauthorized: false,
  // },
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendWelcomeEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to MedInsight',
      html: `
        <h1>Welcome to MedInsight, ${email}h1>
        <p>Thank you for registering with MedInsight. We're excited to have you on board.</p>
        <p>With your account, you can:</p>
        <ul>
          <li>Book appointments with healthcare practitioners</li>
          <li>Access your medical records</li>
          <li>Receive test results online</li>
          <li>Manage your health metrics</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The MedInsight Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Welcome email sent to: ${email}`)
  } catch (error) {
    logger.error('Error sending welcome email:', error)
    throw new Error('Failed to send welcome email')
  }
}

const sendLoginNotificationEmail = async (
  email,
  firstName,
  loginTime,
  ipAddress,
  deviceInfo
) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'New Account Access - MedInsight',
      html: `
        <h1>New Account Access</h1>
        <p>Hello ${firstName},</p>
        <p>Your MedInsight account was accessed at ${loginTime}.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Time: ${loginTime}</li>
          <li>IP Address: ${ipAddress}</li>
          <li>Device: ${deviceInfo}</li>
        </ul>
        <p>If this was you, you can ignore this email.</p>
        <p>If you did not access your account, please contact our support team immediately and change your password.</p>
        <p>Best regards,<br>The MedInsight Security Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Login notification email sent to: ${email}`)
  } catch (error) {
    logger.error('Error sending login notification email:', error)
    throw new Error('Failed to send login notification email')
  }
}

const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Password reset email sent to: ${email}`)
  } catch (error) {
    logger.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/email-verified?token=${token}`

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verification Email Link</a>
        <p>This link will expire in 1 hour. Here is the token: ${token}</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    logger.info(`Email verification email sent to: ${email}`)
  } catch (error) {
    logger.error('Error sending email verification email:', error)
    throw new Error('Failed to send email verification email')
  }
}

module.exports = {
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
}

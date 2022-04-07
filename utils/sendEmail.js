import nodemailer from 'nodemailer';

const sendConfirmationEmail = (emailMsg) => {
  return new Promise((res, rej) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    transporter.sendMail(emailMsg, function (error, data) {
      error ? rej(error) : res(data);
    });
  });
};

export const sendEmailConfirmation = function ({ receiver, activationToken }) {
  const emailMsg = {
    from: process.env.GOOGLE_USER,
    to: `${receiver.email}`,
    subject: 'Product Management - Account Confirmation',
    html: `
      <h2>Hi, ${receiver.firstName} ${receiver.lastName}</h2>
      <p>Thank you for registering into our Application</p>
      <p>To activate your account please follow the&nbsp;<a target="_blank" href="${process.env.CLIENT_DOMAIN}/account-activation/${activationToken}">Activation link</a></p>
      <p>sincerely</p>
      <p>Your Application Team</p>
      `,
  };
  return sendConfirmationEmail(emailMsg);
};

export const sendEmailResetToken = function ({ receiver, resetToken }) {
  const emailMsg = {
    from: process.env.GOOGLE_USER,
    to: `${receiver.email}`,
    subject: 'Product Management - Forgot Password',
    html: `
      <h2>Hi, ${receiver.firstName} ${receiver.lastName}</h2>
      <p>We've received a request to reset your password for the account associated with ${receiver.email}.</p>
      <p>No changes have been made to your account yet. You can reset your password by click the link below:</p>
      <a href="${process.env.CLIENT_DOMAIN}/reset-password/${resetToken}" target="_blank">Reset your password</a>
      <p>sincerely</p>
      <p>Your Application Team</p>
      `,
  };
  return sendConfirmationEmail(emailMsg);
};

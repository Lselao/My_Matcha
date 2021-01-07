const sendmail = require('sendmail')();

class Email {
  static ConfirmationEmail(email, token) {
      sendmail(
        {
          from: 'no-reply@matcha.com',
          to: email,
          subject: 'Confirmation Email',
          html: `
        <p>Click <a href="http://localhost:3000/verify/${token}"> confirm your account</p>`,
      }
      );
    };

  static PasswordResetEmail(email, token) {
    sendmail(
      {
        from: 'no-reply@matcha.com',
        to: email,
        subject: 'Reset Password',
        html: `<p>You requested for your password to be reset</p>
        <p>Click <a href="http://localhost:3000/reset/${token}">this link to change your password</p>`,
      }
    );
  }
}

module.exports = Email;

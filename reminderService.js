const nodemailer = require('nodemailer');
const cron = require('node-cron');
const axios = require('axios');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'your.email@example.com', 
    pass: 'your-email-password', 
  },
});


const sendReminderEmail = async () => {


  const mailOptions = {
    from: 'your.email@example.com',
    to: 'user.email@example.com', 
    subject: '[Your Web Name]: Reminder to record your daily expenses :)',
    text: 'Hi there, just a friendly reminder to update your daily expenses on [Your Web Name]. Have a great day!',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending reminder email:', error);
    } else {
      console.log('Reminder email sent:', info.response);
    }
  });
};

cron.schedule('0 20 * * *', () => {
  console.log('Running scheduled task to send reminder emails');
  sendReminderEmail();
});

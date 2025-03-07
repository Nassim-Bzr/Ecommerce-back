const csurf = require('csurf');

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // à true en production si vous utilisez HTTPS
    sameSite: 'strict'
  }
});

module.exports = csrfProtection;

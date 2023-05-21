const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const { email } = require('../../config/config')

let transporter = null

const getTransporter = () => {
  if (!transporter) {
    if (email.service === 'smtp') {
      transporter = nodemailer.createTransport({
        host: email.smtp.host,
        port: email.smtp.port,
        secure: email.smtp.secure,
        auth: {
          user: email.auth.user,
          pass: email.auth.pass
        },
        tls: {
          ciphers: email.smtp.tls.ciphers
        }
      })
    } else if (email.service === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email.auth.user,
          pass: email.auth.pass
        }
      })
    }

    transporter.use('compile', hbs({
      viewEngine: {
        extname: '.hbs',
        layoutsDir: 'src/emailTemplates/',
        defaultLayout: false,
        partialsDir: 'src/emailTemplates/'
      },
      viewPath: 'src/emailTemplates/',
      extName: '.hbs'
    }))
  }
  return transporter
}

const sendEmail = (to, subject, text) => {
  getTransporter().sendMail({
    from: email.address,
    to,
    subject,
    text
  }, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info)
    }
  })
}

const sendEmailFromTemplate = async ({ to, subject, template, context }) => {
  return new Promise((resolve, reject) => {
    getTransporter().sendMail({
      from: email.address,
      to,
      subject,
      template,
      context
    }, (err, info) => {
      if (err) {
        return resolve({ result: null, error: err })
      } else {
        return resolve({ result: info, error: null })
      }
    })
  })
}

module.exports = {
  sendEmail,
  sendEmailFromTemplate
}

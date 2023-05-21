exports.environment = 'production'

exports.server = {
  port: 3000,
  hostname: 'localhost',
  protocol: 'http',
  externalUrl: 'localhost:3000',
  uploadFolder: 'public/uploads/'
}

exports.token = {
  expirationToken: 365,
  expirationUnit: 'd', // d: days, h: hours, m: minutes, s: seconds
  expirationUnitLong: 'days', // days, hours, minutes, seconds
  expirationRecoverEmailToken: 10,
  expirationRecoverEmailTokenUnit: 'm',
  expirationValidationEmailToken: 1,
  expirationValidationEmailTokenUnit: 'd'
}

exports.swagger = {
  active: false
}

exports.email = {
  service: 'gmail', // smtp or gmail
  address: 'Test 👻 <test@test.com>',
  auth: {
    user: 'test@test.com',
    pass: '12341234'
  },
  smtp: {
    host: 'smtp.test.com',
    port: 587,
    secure: true
  }
}

// Used in the sending mails
exports.company = {
  logoUrl: 'https://ci3.googleusercontent.com/mail-sig/AIorK4yp-GBR6pQ-LZ_-0fxvJLOnnA5cxdRFFuU2k9WxgZrsBqIr2txON4AOTq2f_thRjJU_lLqC1hE"',
  companyName: 'Company Name',
  companyAddress: 'Company Address',
  companyPhone: 'Company Phone',
  companyEmail: 'Company Email',
  companyWebsite: 'Company Website',
  primaryColor: '#009750',
  primaryColorHover: '#008c47',
  secondaryColor: '#231F20',
  textColor: '#231F20',
  textColorSmooth: '#76696c'
}

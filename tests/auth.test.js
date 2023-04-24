
/* eslint-disable n/handle-callback-err */
/* eslint-disable no-undef */

const config = require('../config/config').server
const baseUrl = `${config.hostname}:${config.port}`
const request = require('supertest')(baseUrl)
const module = 'auth'

const login = (resolve, reject) => {
  return request.post('/auth/login')
    .send({
      email: 'admin@ferranmaso.com',
      password: '12341234'
    })
    .end((err, res) => {
      if (err) reject(err)
      resolve(res.body.data.token)
    })
}

describe(`MODULE: ${module}`, () => {
  describe('Register and login', () => {
    test('Register short and login', (done) => {
      login(async (token) => {
        const id = await new Promise((resolve, reject) => {
          request.post(`/${module}/fast-register`)
            .send({
              email: 'test@ferranmaso.com',
              username: 'test',
              password: '12341234',
              newsletter: true,
              conditions: true
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data.id).toBeTruthy()
              const id = res.body.data.id || null
              expect(res.body.data.username).toStrictEqual('test')
              expect(res.body.data.email).toStrictEqual('test@ferranmaso.com')
              expect(res.body.data.newsletter).toStrictEqual(true)
              expect(res.body.data.conditions).toStrictEqual(true)
              expect(res.body.data.token).toBeTruthy()
              expect(res.body.data.password).toBeFalsy()
              resolve(id)
            })
        })

        // bad register
        await new Promise((resolve, reject) => {
          request.post(`/${module}/fast-register`)
            .send({
              email: 'test@ferranmaso.com',
              username: 'test',
              password: '12',
              newsletter: true,
              conditions: true
            })
            .expect(400)
            .end((err, res) => {
              expect(res.body.data).toBeFalsy()
              expect(res.body.error.password).toStrictEqual(['The password must be at least 8 characters.'])
              expect(res.body.error.username).toStrictEqual(['USERNAME_ALREADY_EXISTS'])
              expect(res.body.error.email).toStrictEqual(['EMAIL_ALREADY_EXISTS'])
              resolve()
            })
        })

        // login
        await new Promise((resolve, reject) => {
          request.post(`/${module}/login`)
            .send({
              email: 'test@ferranmaso.com',
              password: '12341234'
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data.username).toStrictEqual('test')
              expect(res.body.data.email).toStrictEqual('test@ferranmaso.com')
              expect(res.body.data.password).toBeFalsy()
              expect(res.body.data.token).toBeTruthy()
              resolve()
            })
        })

        // login bad password
        await new Promise((resolve, reject) => {
          request.post(`/${module}/login`)
            .send({
              email: 'test@ferranmaso.com',
              password: 'badpassword'
            })
            .expect(400)
            .end((err, res) => {
              expect(res.body.data).toBeFalsy()
              expect(res.body.error).toBeTruthy()
              expect(res.body.error).toStrictEqual('INVALID_PASSWORD')
              resolve()
            })
        })

        // login bad email
        await new Promise((resolve, reject) => {
          request.post(`/${module}/login`)
            .send({
              email: 'bademail@ferranmaso.com',
              password: '12341234'
            })
            .expect(400)
            .end((err, res) => {
              expect(res.body.data).toBeFalsy()
              expect(res.body.error).toBeTruthy()
              expect(res.body.error).toStrictEqual('EMAIL_NOT_FOUND')
              resolve()
            })
        })

        await new Promise((resolve, reject) => {
          request.delete(`/user/delete/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              console.log(err)
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        done()
      })
    })
  })

  describe('Register long', () => {
    test('Register', (done) => {
      login(async (token) => {
        const id = await new Promise((resolve, reject) => {
          request.post(`/${module}/register`)
            .send({
              email: 'test2@ferranmaso.com',
              username: 'test2',
              password: '12341234',
              newsletter: true,
              conditions: true,
              name: 'Ferran Masó',
              bio: "I'm a developer",
              address: 'Carrer de la Pau, 1',
              city: 'Barcelona',
              country: 'Spain',
              postalCode: '08001',
              phone: '666666666',
              birthday: '1991-05-31'
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data.id).toBeTruthy()
              const id = res.body.data.id || null
              expect(res.body.data.username).toStrictEqual('test2')
              expect(res.body.data.email).toStrictEqual('test2@ferranmaso.com')
              expect(res.body.data.newsletter).toStrictEqual(true)
              expect(res.body.data.conditions).toStrictEqual(true)
              expect(res.body.data.name).toStrictEqual('Ferran Masó')
              expect(res.body.data.bio).toStrictEqual("I'm a developer")
              expect(res.body.data.address).toStrictEqual('Carrer de la Pau, 1')
              expect(res.body.data.city).toStrictEqual('Barcelona')
              expect(res.body.data.country).toStrictEqual('Spain')
              expect(res.body.data.postalCode).toStrictEqual('08001')
              expect(res.body.data.phone).toStrictEqual('666666666')
              expect(res.body.data.birthday).toStrictEqual('1991-05-31T00:00:00.000Z')
              expect(res.body.data.token).toBeTruthy()
              expect(res.body.data.password).toBeFalsy()
              resolve(id)
            })
        })

        await new Promise((resolve, reject) => {
          request.post(`/${module}/register`)
            .send({
              email: 'test2@ferranmaso.com',
              username: 'test2',
              password: '1',
              newsletter: true,
              conditions: true,
              name: 'Ferran Masó',
              bio: "I'm a developer",
              address: 'Carrer de la Pau, 1',
              city: 'Barcelona',
              country: 'Spain',
              postalCode: '0800112341234',
              phone: '6666666666666666666666666',
              birthday: '1991-30-50'
            })
            .expect(400)
            .end((err, res) => {
              expect(res.body.data).toBeFalsy()
              expect(res.body.error.username).toStrictEqual(['USERNAME_ALREADY_EXISTS'])
              expect(res.body.error.email).toStrictEqual(['EMAIL_ALREADY_EXISTS'])
              expect(res.body.error.phone).toStrictEqual(['The phone may not be greater than 20 characters.'])
              expect(res.body.error.password).toStrictEqual(['The password must be at least 8 characters.'])
              expect(res.body.error.postalCode).toStrictEqual(['The postalCode may not be greater than 10 characters.'])
              expect(res.body.error.birthday).toStrictEqual(['The birthday is not a valid date format.'])
              resolve()
            })
        })

        await new Promise((resolve, reject) => {
          request.delete(`/user/delete/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        done()
      })
    })
  })
})

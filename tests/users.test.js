/* eslint-disable n/handle-callback-err */
/* eslint-disable no-undef */
const config = require('../config/config').server
const baseUrl = `${config.hostname}:${config.port}`
const request = require('supertest')(baseUrl)
const module = 'user'

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
  describe('Get users', () => {
    test('Get all users - error unauthorized', (done) => {
      request.get(`/${module}/getAll`)
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toStrictEqual('AUTH_FAILED')
          done()
        })
    })

    test('Get all users - OK', (done) => {
      login(async (token) => {
        request.get(`/${module}/getAll`)
          .set('x-access-token', `${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.data).toBeTruthy()
            expect(res.body.data.length).toBeGreaterThan(0)
            done()
          })
      })
    })
  })

  describe('Create and update user', () => {
    test('Create user - error unauthorized', (done) => {
      request.post(`/${module}/create`)
        .send({
          email: 'test3@ferranmaso.com',
          username: 'test3',
          password: '12341234',
          newsletter: true,
          conditions: true,
          name: 'Ferran Masó 3',
          bio: "I'm a developer",
          address: 'Carrer de la Pau, 1',
          city: 'Barcelona',
          country: 'Spain',
          postalCode: '08001',
          phone: '666666666',
          birthday: '1991-05-31'
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toStrictEqual('AUTH_FAILED')
          done()
        })
    })

    test('Create and update user - ok', (done) => {
      login(async (token) => {
        // Create user
        const id = await new Promise((resolve, reject) => {
          request.post(`/${module}/create`)
            .set('x-access-token', `${token}`)
            .send({
              email: 'test3@ferranmaso.com',
              username: 'test3',
              password: '12341234',
              newsletter: true,
              conditions: true,
              name: 'Ferran Masó 3',
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
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.id).toBeTruthy()
              expect(res.body.data.email).toStrictEqual('test3@ferranmaso.com')
              expect(res.body.data.username).toStrictEqual('test3')
              expect(res.body.data.newsletter).toStrictEqual(true)
              expect(res.body.data.conditions).toStrictEqual(true)
              expect(res.body.data.name).toStrictEqual('Ferran Masó 3')
              expect(res.body.data.bio).toStrictEqual("I'm a developer")
              expect(res.body.data.address).toStrictEqual('Carrer de la Pau, 1')
              expect(res.body.data.city).toStrictEqual('Barcelona')
              expect(res.body.data.country).toStrictEqual('Spain')
              expect(res.body.data.postalCode).toStrictEqual('08001')
              expect(res.body.data.phone).toStrictEqual('666666666')
              expect(res.body.data.birthday).toStrictEqual('1991-05-31T00:00:00.000Z')
              resolve(res.body.data.id)
            })
        })

        // Update the user
        await new Promise((resolve, reject) => {
          request.put(`/${module}/update/${id}`)
            .set('x-access-token', `${token}`)
            .send({
              name: 'Ferran Mas',
              bio: "I'm seriously a developer",
              newsletter: false,
              conditions: false,
              address: 'Carrer de la Pau, 2',
              city: 'Olot',
              country: 'Spain?',
              postalCode: '17800',
              phone: '777777777',
              birthday: '1991-05-30'
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Check if the user has been updated
        await new Promise((resolve, reject) => {
          request.get(`/${module}/get/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.name).toStrictEqual('Ferran Mas')
              expect(res.body.data.bio).toStrictEqual('I\'m seriously a developer')
              expect(res.body.data.address).toStrictEqual('Carrer de la Pau, 2')
              expect(res.body.data.city).toStrictEqual('Olot')
              expect(res.body.data.country).toStrictEqual('Spain?')
              expect(res.body.data.postalCode).toStrictEqual('17800')
              expect(res.body.data.phone).toStrictEqual('777777777')
              expect(res.body.data.birthday).toStrictEqual('1991-05-30T00:00:00.000Z')
              resolve()
            })
        })

        // Delete the user
        await new Promise((resolve, reject) => {
          request.delete(`/${module}/delete/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Check if user is deleted
        await new Promise((resolve, reject) => {
          request.get(`/${module}/get/${id}`)
            .set('x-access-token', `${token}`)
            .expect(404)
            .end((err, res) => {
              expect(res.body.error).toStrictEqual('USER_NOT_FOUND')
              resolve()
            })
        })

        done()
      })
    })

    test('Create user with avatar', (done) => {
      login(async (token) => {
        // Create the user
        const id = await new Promise((resolve, reject) => {
          request.post(`/${module}/createWithAvatar`)
            .set('x-access-token', `${token}`)
            .field('email', 'fm3@ferranmaso.com')
            .field('username', 'fm3')
            .field('password', '12341234')
            .field('newsletter', true)
            .field('conditions', true)
            .field('name', 'Ferran Masó 3')
            .field('bio', "I'm a developer")
            .field('address', 'Carrer de la Pau, 1')
            .field('city', 'Barcelona')
            .field('country', 'Spain')
            .field('postalCode', '08001')
            .field('phone', '666666666')
            .field('birthday', '1991-05-31')
            .attach('avatar', 'tests/avatar.png')
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.id).toBeTruthy()
              expect(res.body.data.email).toStrictEqual('fm3@ferranmaso.com')
              expect(res.body.data.username).toStrictEqual('fm3')
              expect(res.body.data.newsletter).toStrictEqual(true)
              expect(res.body.data.conditions).toStrictEqual(true)
              expect(res.body.data.name).toStrictEqual('Ferran Masó 3')
              expect(res.body.data.bio).toStrictEqual("I'm a developer")
              expect(res.body.data.address).toStrictEqual('Carrer de la Pau, 1')
              expect(res.body.data.city).toStrictEqual('Barcelona')
              expect(res.body.data.country).toStrictEqual('Spain')
              expect(res.body.data.postalCode).toStrictEqual('08001')
              expect(res.body.data.phone).toStrictEqual('666666666')
              expect(res.body.data.birthday).toStrictEqual('1991-05-31T00:00:00.000Z')
              expect(res.body.data.avatar).toBeTruthy()
              resolve(res.body.data.id)
            })
        })

        // Update avatar
        await new Promise((resolve, reject) => {
          request.post(`/${module}/updateAvatar/${id}`)
            .set('x-access-token', `${token}`)
            .attach('avatar', 'tests/avatar2.png')
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Delete the user
        await new Promise((resolve, reject) => {
          request.delete(`/${module}/delete/${id}`)
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

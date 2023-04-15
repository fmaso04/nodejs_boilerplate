/* eslint-disable n/handle-callback-err */
/* eslint-disable no-undef */
const config = require('../config/config').server
const baseUrl = `${config.hostname}:${config.port}`
const request = require('supertest')(baseUrl)
const module = 'security'

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
  describe('Get modules', () => {
    test('Get all modules - error unauthorized', (done) => {
      request.get(`/${module}/getModules`)
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toStrictEqual('AUTH_FAILED')
          done()
        })
    })

    test('Get all modules - OK', (done) => {
      login(async (token) => {
        request.get(`/${module}/getModules`)
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

  describe('Create and update module', () => {
    test('Create module - error unauthorized', (done) => {
      request.post(`/${module}/createModule`)
        .send({
          name: 'test_module_bad'
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toStrictEqual('AUTH_FAILED')
          done()
        })
    })

    test('Create and update module - ok', (done) => {
      login(async (token) => {
        // Create module
        const id = await new Promise((resolve, reject) => {
          request.post(`/${module}/createModule`)
            .set('x-access-token', `${token}`)
            .send({
              name: 'test_module'
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.id).toBeTruthy()
              expect(res.body.data.name).toStrictEqual('test_module')
              resolve(res.body.data.id)
            })
        })

        await new Promise((resolve, reject) => {
          request.post(`/${module}/createModule`)
            .set('x-access-token', `${token}`)
            .send({
              name: 'test_module'
            })
            .expect(400)
            .end((err, res) => {
              expect(res.data).toBeFalsy()
              expect(res.body.error).toBeTruthy()
              expect(res.body.error.name).toBeTruthy()
              expect(res.body.error.name[0]).toStrictEqual('NAME_ALREADY_EXISTS')
              resolve()
            })
        })

        // Update the module
        await new Promise((resolve, reject) => {
          request.put(`/${module}/updateModule/${id}`)
            .set('x-access-token', `${token}`)
            .send({
              name: 'test_module_updated'
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Can update to same name
        await new Promise((resolve, reject) => {
          request.put(`/${module}/updateModule/${id}`)
            .set('x-access-token', `${token}`)
            .send({
              name: 'test_module_updated'
            })
            .expect(200)
            .end((err, res) => {
              console.log(res.body)
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Can't update to existing name which is not the current one
        await new Promise((resolve, reject) => {
          request.put(`/${module}/updateModule/${id}`)
            .set('x-access-token', `${token}`)
            .send({
              name: 'User'
            })
            .expect(400)
            .end((err, res) => {
              expect(res.data).toBeFalsy()
              expect(res.body.error).toBeTruthy()
              expect(res.body.error.name).toBeTruthy()
              expect(res.body.error.name[0]).toStrictEqual('NAME_ALREADY_EXISTS')
              resolve()
            })
        })

        // Check if the module has been updated
        await new Promise((resolve, reject) => {
          request.get(`/${module}/getModule/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.name).toStrictEqual('test_module_updated')
              resolve()
            })
        })

        // Delete the module
        await new Promise((resolve, reject) => {
          request.delete(`/${module}/deleteModule/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Check if module is deleted
        await new Promise((resolve, reject) => {
          request.get(`/${module}/getModule/${id}`)
            .set('x-access-token', `${token}`)
            .expect(404)
            .end((err, res) => {
              expect(res.body.error).toStrictEqual('MODULE_NOT_FOUND')
              resolve()
            })
        })

        done()
      })
    })
  })
})

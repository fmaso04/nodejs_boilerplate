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

describe(`PERMISSION: ${module}`, () => {
  describe('Get permissions', () => {
    test('Get all permissions - error unauthorized', (done) => {
      request.get(`/${module}/getPermissions`)
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toStrictEqual('AUTH_FAILED')
          done()
        })
    })

    test('Get all permissions - OK', (done) => {
      login(async (token) => {
        request.get(`/${module}/getPermissions`)
          .set('x-access-token', `${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.data).toBeTruthy()
            // expect(res.body.data.length).toBeGreaterThan(0)
            done()
          })
      })
    })
  })

  describe('Create and update permission', () => {
    test('Create permission - error unauthorized', (done) => {
      request.post(`/${module}/createPermission`)
        .send({
          code: 'test_permission_bad',
          description: 'test_permission_description_bad',
          moduleId: '-1'
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toStrictEqual('AUTH_FAILED')
          done()
        })
    })

    test('Create and update permission - ok', (done) => {
      login(async (token) => {
        const moduleId = await new Promise((resolve, reject) => {
          request.post(`/${module}/createModule`)
            .set('x-access-token', `${token}`)
            .send({
              name: 'test_mod_perm'
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.id).toBeTruthy()
              expect(res.body.data.name).toStrictEqual('test_mod_perm')
              resolve(res.body.data.id)
            })
        })

        // Create permission
        const id = await new Promise((resolve, reject) => {
          request.post(`/${module}/createPermission`)
            .set('x-access-token', `${token}`)
            .send({
              code: 'test_permission',
              description: 'test_permission_description',
              moduleId
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.id).toBeTruthy()
              expect(res.body.data.code).toStrictEqual('test_permission')
              expect(res.body.data.description).toStrictEqual('test_permission_description')
              expect(res.body.data.moduleId).toBeTruthy()
              resolve(res.body.data.id)
            })
        })

        await new Promise((resolve, reject) => {
          request.post(`/${module}/createPermission`)
            .set('x-access-token', `${token}`)
            .send({
              code: 'test_permission',
              description: 'test_permission_description',
              moduleId
            })
            .expect(400)
            .end((err, res) => {
              expect(res.data).toBeFalsy()
              expect(res.body.error).toBeTruthy()
              expect(res.body.error.code).toBeTruthy()
              expect(res.body.error.code[0]).toStrictEqual('CODE_ALREADY_EXISTS')
              resolve()
            })
        })

        // Update the module
        await new Promise((resolve, reject) => {
          request.put(`/${module}/updatePermission/${id}`)
            .set('x-access-token', `${token}`)
            .send({
              code: 'test_permupd',
              description: 'test_permission_description_updated'
            })
            .expect(200)
            .end((err, res) => {
              console.log(err, res)
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Can update to same code
        await new Promise((resolve, reject) => {
          request.put(`/${module}/updatePermission/${id}`)
            .set('x-access-token', `${token}`)
            .send({
              code: 'test_permupd',
              description: 'test_permission_description_updated'
            })
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Can't update to existing code which is not the current one
        /* await new Promise((resolve, reject) => {
          request.put(`/${module}/updatePermission/${id}`)
            .set('x-access-token', `${token}`)
            .send({
              code: 'CREATE_PERMISSION',
            })
            .expect(400)
            .end((err, res) => {
              expect(res.data).toBeFalsy()
              expect(res.body.error).toBeTruthy()
              expect(res.body.error.code).toBeTruthy()
              expect(res.body.error.code[0]).toStrictEqual('CODE_ALREADY_EXISTS')
              resolve()
            })
        }) */

        // Check if the module has been updated
        await new Promise((resolve, reject) => {
          request.get(`/${module}/getPermission/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              expect(res.body.data.code).toStrictEqual('test_permupd')
              expect(res.body.data.description).toStrictEqual('test_permission_description_updated')
              resolve()
            })
        })

        // Delete the permission
        await new Promise((resolve, reject) => {
          request.delete(`/${module}/deletePermission/${id}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Delete the module
        await new Promise((resolve, reject) => {
          request.delete(`/${module}/deleteModule/${moduleId}`)
            .set('x-access-token', `${token}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data).toBeTruthy()
              resolve()
            })
        })

        // Check if permission is deleted
        await new Promise((resolve, reject) => {
          request.get(`/${module}/getPermission/${id}`)
            .set('x-access-token', `${token}`)
            .expect(404)
            .end((err, res) => {
              expect(res.body.error).toStrictEqual('PERMISSION_NOT_FOUND')
              resolve()
            })
        })

        done()
      })
    })
  })
})

/* eslint-disable n/handle-callback-err */
/* eslint-disable no-undef */

const config = require('../config/config').server
const baseUrl = `${config.hostname}:${config.port}`
const request = require('supertest')(baseUrl)
const module = 'playground'

describe(`MODULE: ${module}`, () => {
  test('Simple comparation', (done) => {
    expect(1).toStrictEqual(1)
    done()
  })

  describe('Incremental variable', () => {
    test('Simple incrementation', (done) => {
      let i = 1
      expect(i).toStrictEqual(1)
      i++
      expect(i).toStrictEqual(2)
      done()
    })

    test('Advanced incrementation', (done) => {
      let i = 1
      expect(i).toStrictEqual(1)
      i += i
      expect(i).toStrictEqual(2)
      i += i
      expect(i).toStrictEqual(4)
      i += i
      expect(i).toStrictEqual(8)
      done()
    })
  })

  describe('Petitions test', () => {
    test('Get test', (done) => {
      request.get(`/${module}/test-get`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.msg).toStrictEqual('TEST GET PETITION!')
          expect(res.body.values).toStrictEqual([1, 2, 3, 4, 5])
          done()
        })
    })

    test('Get test', (done) => {
      request.get(`/${module}/test-get/100`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.msg).toStrictEqual('TEST GET PETITION!')
          expect(res.body.id).toStrictEqual('100')
          expect(res.body.values).toStrictEqual([1, 2, 3, 4, 5])
          done()
        })
    })

    test('Save json test', (done) => {
      request.post(`/${module}/test-post-json`)
        .send({ Name: 'Test', Description: 'Test description', AnyNumber: 100, AnyBoolean: true })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.Name).toStrictEqual('Test')
          expect(res.body.Description).toStrictEqual('Test description')
          expect(res.body.AnyNumber).toStrictEqual(100)
          expect(res.body.AnyBoolean).toStrictEqual(true)
          done()
        })
    })

    test('Save form data test', (done) => {
      request.post(`/${module}/test-post-formData`)
        .field('Name', 'Test')
        .field('Description', 'Test description')
        .field('AnyNumber', 100)
        .field('AnyBoolean', true)
        .attach('file', './public/test.png')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.Name).toStrictEqual('Test')
          expect(res.body.Description).toStrictEqual('Test description')
          expect(res.body.AnyNumber).toStrictEqual('100')
          expect(res.body.AnyBoolean).toStrictEqual('true')
          expect(res.body.file).toStrictEqual('test.png')
          done()
        })
    })

    test('Save x-www-form-urlencoded test', (done) => {
      request.post(`/${module}/test-post-x-www-form-urlencoded`)
        .send('Name=Test&Description=Test description&AnyNumber=100&AnyBoolean=true')
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.Name).toStrictEqual('Test')
          expect(res.body.Description).toStrictEqual('Test description')
          expect(res.body.AnyNumber).toStrictEqual('100')
          expect(res.body.AnyBoolean).toStrictEqual('true')
          done()
        })
    })

    test('Update test', (done) => {
      request.put(`/${module}/test-put/100`)
        .send({ Name: 'Test', Description: 'Test description', AnyNumber: 100, AnyBoolean: true })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.Name).toStrictEqual('Test')
          expect(res.body.Description).toStrictEqual('Test description')
          expect(res.body.AnyNumber).toStrictEqual(100)
          expect(res.body.AnyBoolean).toStrictEqual(true)
          done()
        })
    })

    test('Delete test', (done) => {
      request.delete(`/${module}/test-delete/100`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body.msg).toStrictEqual('DELETE ROW: 100')
          done()
        })
    })

    test('Fail row', (done) => {
      request.get(`${module}/test-fail`).expect(500)
      done()
    })
  })
})

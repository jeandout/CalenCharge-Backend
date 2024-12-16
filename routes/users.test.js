const request = require('supertest');
const app = require('../app.js');

it('POST /users/signup', async () => {

    const res = await request(app).post('/users/signup').send({
      email: 'john@gmail.com',
      password: 'azerty123',
      store:[]
    });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body).toHaveProperty('token');
   });
const request = require('supertest');
const app = require('./app');

it('GET /products', async () => {
 const res = await request(app).get('/products');

 expect(res.statusCode).toBe(200);
 expect(res.body.stock).toEqual(['iPhone', 'iPad', 'iPod']);
});

it('POST /users', async () => {
    const res = await request(app).post('/users').send({
      email: 'john@gmail.com',
      password: 'azerty123',
    });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
   });
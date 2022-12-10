import chai, { use } from 'chai';
import { server } from '../index.js';
import chaiHttp from 'chai-http';
import { getUserToken } from './1_user.js';
import { response } from 'express';

chai.should();
chai.use(chaiHttp);

describe('Orders end-point API Calls', () => {
  let orderId = '';
  describe('POST /orders/place', () => {
    const order = {
      products: [
        {
          id: 3,
          categoryId: 1,
          price: 783.02,
          quantity: 1,
        },
        {
          id: 2,
          categoryId: 1,
          price: 719.25,
          quantity: 1,
        },
      ],
      quantity: 2,
      total: 1502.27,
    };

    it('Order placing', (done) => {
      chai
        .request(server)
        .post('/order/place')
        .set('Cookie', `user_token=${getUserToken()}`)
        .send(order)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          orderId = response.body.id;
          done();
        });
    });
  });
  describe('GET /orders', () => {
    it('Getting list of all user orders', (done) => {
      chai
        .request(server)
        .get('/orders')
        .set('Cookie', `user_token=${getUserToken()}`)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          done();
        });
      it('Try to get order list without auth', (done) => {
        chai
          .request(server)
          .get('/orders')
          .end((err, resp) => {
            resp.should.have.status(401);
            response.body.should.be.a('object');
            resp.body.should.have.property('error');
            done();
          });
      });
    });
  });

  describe('GET /order/:id', () => {
    it('Getting details of placed order', (done) => {
      chai
        .request(server)
        .get(`/order/${orderId}`)
        .set('Cookie', `user_token=${getUserToken()}`)
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          resp.body.should.have.property('orderSummary');
          resp.body.should.have.property('orderedItems');
          done();
        });
    });
  });
});

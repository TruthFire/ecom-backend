import chai, { use } from 'chai';
import { server } from '../index.js';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

describe('Products end-point API Calls', () => {
  describe('GET /products/categories', () => {
    it('Fetching product category list', (done) => {
      chai
        .request(server)
        .get('/products/categories')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /products?new=true', () => {
    it('Fetches 10 newest products, that were added to DB', (done) => {
      chai
        .request(server)
        .get('/products?new=true')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.a('array');
          done();
        });
    });
  });

  describe('GET /products/:id', () => {
    it('Fetches selected product from DB', (done) => {
      chai
        .request(server)
        .get('/products/4')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');
          resp.body.should.have.property('categoryId');
          resp.body.should.have.property('name');
          resp.body.should.have.property('price');
          resp.body.should.have.property('amountLeft');
          done();
        });
    });
  });
});

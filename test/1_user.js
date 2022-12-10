import chai from 'chai';
import { server } from '../index.js';
import chaiHttp from 'chai-http';
import { getCookieValue } from './testUtils.js';

chai.should();
chai.use(chaiHttp);
var user_token;
describe('Users API Calls', () => {
  /**
   * TEST User login
   */

  describe('POST /auth/login', () => {
    const user = {
      userLogin: 'test125@gmail.com',
      password: 'test1234',
    };
    it('User authorization', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send(user)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('id', 11);
          response.body.should.have.property('firstname');
          response.body.should.have.property('lastname');
          response.should.have.cookie('user_token');

          user_token = getCookieValue(
            response.header['set-cookie'],
            'user_token'
          );
          done();
        });
    });
    it('User authorization with incorrect values', (done) => {
      chai
        .request(server)
        .post('/auth/login')
        .send({
          userLogin: 'test12@gmail.com',
          password: 'test1234',
        })
        .end((err, resp) => {
          resp.should.have.status(404);
          done();
        });
    });
  });

  /**
   * Test User update
   */

  describe('PUT /user/:id', () => {
    const newUser = {
      email: 'test125@gmail.com',
      password: 'test1234',
      firstname: 'Testing',
      lastname: 'Polo',
    };

    it('Updates firstname of current user', (done) => {
      chai
        .request(server)
        .put('/user/11')
        .set('Cookie', `user_token=${user_token}`)
        .send(newUser)
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          resp.body.should.have.property('id', '11');
          resp.body.should.have.property('firstname', 'Testing');
          resp.body.should.have.property('lastname');
          resp.body.should.have.property('email');
          done();
        });
    });

    const oldUser = {
      email: 'test125@gmail.com',
      password: 'test1234',
      firstname: 'Marco',
      lastname: 'Polo',
    };

    it("Revert of updating current user's firstname", (done) => {
      chai
        .request(server)
        .put('/user/11')
        .set('Cookie', `user_token=${user_token}`)
        .send(oldUser)
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          resp.body.should.have.property('id', '11');
          resp.body.should.have.property('firstname', 'Marco');
          resp.body.should.have.property('lastname');
          resp.body.should.have.property('email');
          done();
        });
    });
  });

  describe('GET /auth/me', () => {
    it('Gets public data of current user', (done) => {
      chai
        .request(server)
        .get('/auth/me/?id=11')
        .set('Cookie', `user_token=${user_token}`)
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.should.be.a('object');
          resp.body.should.have.property('firstname');
          resp.body.should.have.property('lastname');
          resp.body.should.have.property('email');

          done();
        });
    });
  });
});

export const getUserToken = () => {
  return user_token;
};

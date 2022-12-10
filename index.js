//zv6PxAKEnADlo2pb
import * as dotenv from 'dotenv';
dotenv.config();
import Express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  UserController,
  ProductController,
  OrderController,
} from './Controller/index.js';
import { loginValidation, registerValidation } from './Validators.js';
import HandleValidationErrors from './Utils/HandleValidationErrors.js';

const app = Express();

export const server = app.listen(8080, () => {
  console.log('Server started..');
});

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(Express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.post(
  '/auth/register',
  registerValidation,
  HandleValidationErrors,
  UserController.CreateUser
);

app.post(
  '/auth/login',
  loginValidation,
  HandleValidationErrors,
  UserController.AuthUser
);

app.get('/auth/logout', UserController.UserLogout);

app.get('/auth/me', UserController.getCurrentUserInfo);

app.get('/products', ProductController.getProducts);

app.get('/products/categories', ProductController.getCategories);

app.get('/products/:id', ProductController.getProduct);

app.put('/user/:id', UserController.updateMyProfile);

app.post('/order/place', OrderController.placeOrder);

app.get('/orders', OrderController.GetMyOrders);

app.post('/order/:id/process', OrderController.acceptPayment);

app.get('/order/:id', OrderController.getOrderDetails);

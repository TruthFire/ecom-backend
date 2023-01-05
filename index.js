//zv6PxAKEnADlo2pb

import Express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  UserController,
  ProductController,
  OrderController,
  AdminController,
} from './Controller/index.js';
import { loginValidation, registerValidation } from './Validators.js';
import HandleValidationErrors from './Utils/HandleValidationErrors.js';

const app = Express();

export const server = app.listen(8000, () => {
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

//user requests
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

app.put('/user/:id', UserController.updateMyProfile);

app.get('/auth/logout', UserController.UserLogout);
app.get('/auth/me', UserController.getCurrentUserInfo);

//product requests
app.get('/products', ProductController.getProducts);
app.get('/products/categories', ProductController.getCategories);
app.get('/products/:id', ProductController.getProduct);

//orders
app.post('/order/place', OrderController.placeOrder);
app.post('/order/:id/process', OrderController.acceptPayment);

app.get('/orders', OrderController.GetMyOrders);
app.get('/order/:id', OrderController.getOrderDetails);

//admin requests
app.get('/adm/orders/recent', AdminController.GetRecentOrders);
app.get('/adm/stats/turnover', AdminController.getTodayTurnover);
app.get('/adm/stats/users', AdminController.getUserStats);
app.get('/adm/stats/orders', AdminController.getOrderStats);
app.get('/adm/users/', AdminController.GetUserList);
app.get('/adm/user/:id', AdminController.getUserInfo);
app.get('/adm/auth', AdminController.AuthAdm);

app.put('/adm/user/:id', AdminController.updateUser);

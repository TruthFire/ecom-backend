import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Minimal password length is 8 symbols').isLength({ min: 8 }),
  body('username', 'Minimal nickname length is 4 symbols').isLength({ min: 3 }),
  body('firstname', 'Minimal firstname length is 2 symbols').isLength({
    min: 2,
  }),
  body('lastname', 'Minimal lastname length is 2 symbols').isLength({ min: 2 }),
];

export const loginValidation = [
  body('userLogin', 'Invalid email').isString({ min: 5 }),
  body('password', 'Minimal password length is 8 symbols').isLength({ min: 8 }),
];

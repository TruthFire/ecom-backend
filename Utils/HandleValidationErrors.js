import { validationResult } from 'express-validator/src/validation-result.js';

export default (req, resp, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return resp.status(400).json(errs.array());
  }

  next();
};

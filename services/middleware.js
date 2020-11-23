const { validationResult } = require('express-validator');

const validate = validations => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({ errors: errors.array() });
    };
  };

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log(error.name)
  if(error.message == 'invalid email or password') {
    response.status(400).json({error: error.message})
  }
  if(error.errors) {
    const errors = error.errors;
    response.status(400).json({error: errors.map(error => error)})
  }
  next();
}
module.exports = {
    validate,
    errorHandler
}
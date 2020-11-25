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
  if(error.name === 'ValidationError'){
    response.status(400).json({error: error.message})
  }
  if(error.message === 'verification code invalid'){
    response.status(400).json({error: error.message})
  }
  if(error.message === 'unauthorized user'){
    response.status(401).json({error: error.message})
  }
  if(error.errors) {
    const errors = error.errors;
    response.status(400).json({error: errors.map(error => error)})
  }
  next();
}

const getToken = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer')){
    request.token = authorization.substring('7')
  }
  else{
    request.token = null;
  }
  next();
}
module.exports = {
    validate,
    errorHandler,
    getToken
}
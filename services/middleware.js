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

const authenticate = rolesArray => (request, response, next) => {
  next();
  if(request.credentials){
    let authorized = false;
    let i=0;
    while(!authorized && i < rolesArray.length){
      authorized = request.credentials.role.toString() === rolesArray[i]
      i++;
    }
    if(!authorized){response.status(401).json({success: false, message: 'Unauthorized'})}
  }else{
    response.status(401).json({success: false, message: 'Unauthorized'})
  }
}
const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log(error.name)
  if(error.message == 'invalid email or password') {
    response.status(400).json({error: error.message})
  }
  else if(error.name === 'ValidationError'){
    response.status(400).json({error: error.message})
  }
  else if(error.name === 'JsonWebTokenError'){
    response.status(401).json({error: 'Access invalid'})
  }
  else if(error.message === 'verification code invalid'){
    response.status(400).json({error: error.message})
  }
  else if(error.message === 'unauthorized user'){
    response.status(401).json({error: error.message})
  }
  else if(error.errors) {
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
    getToken,
    authenticate,
}
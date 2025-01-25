const {users} = require('../models');
const gerUser =  (req, res,next) => {
  try{
    res.status(200).send({
        message: 'user were returned',
        users
        });

  }catch(error){

    next(error)
  }
};

module.exports = gerUser;
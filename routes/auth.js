//create router register,login
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const router = express.Router();

router.post('/register',async (req,res)=>{
  try {
      const {nom,prenom,telephone,username,password,role}=req.body;
      const user = new User({nom,prenom,telephone,username,password,role});
      await user.save();
      res.status(201).send('User registered successfully');
  } catch (error) {
      res.status(400).send(error.message)
  }
})
//user login 
router.post('/login',async (req,res)=>{
   try {
    const {username,password}=req.body;
    const user = await User.findOne({username: username});
    if(!user){
        return res.status(404).send('user not found')
    }
    const isPasswordMatch =await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
    return res.status(401).send('invalid password')
  }
   const token = jwt.sign({_id:user._id,_role:user.role,_nom:user.nom,prenom:user.prenom,telephone:user.telephone},process.env.JWT_SECRET);
   res.send({token:token})
   } catch (error) {
    res.status(400).send(err.message)
   }
});

module.exports = router;
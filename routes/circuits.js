const express = require('express');
const authenticate = require('../middleware/authenticate')
const Circuit = require('../models/circuit')
const router = express.Router();
const multer = require('multer');
//multer 
const directory = './images/'
const storage = multer.diskStorage({
    destination: (req ,file , cb) => {
        cb(null , directory)
    },
    filename: (req , file ,cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-')
        cb(null , filename)
    }
})
var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
      }
    },
  })
//create a new post 
router.post('/create',upload.single('image'),async (req,res)=>{
    try {    const url = req.protocol + '://'+ req.get('host');

        const {lieu,detail,date_debut,date_fin,agence}=req.body;
        const circuit = new Circuit({lieu,detail,date_debut,date_fin,agence,image:url+ '/images/'+ req.file.filename});
        //const circuit = new Circuit(req.body);

        await circuit.save();
        res.status(201).send('Circuit created successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/',async (req,res)=>{
    try {
        const circuits = await Circuit.find().populate('agence','username')
        res.send(circuits)
    } catch (error) {
        res.status(500).send('server error ')
    }
})
router.get('/:id',async (req,res)=>{
    try {
        const circuit = await Circuit.findById(req.params.id)
        if (!circuit) {
            return res.status(404).json({ message: 'circuit not found' });
        }
        res.send(circuit)
    } catch (error) {
        res.status(500).send('server error ')
    }
})
router.put('/:id',async (req,res)=>{
    try {
       const {id} = req.params;
       const{title,content} = req.body;
       const updatedPost = await Circuit.findByIdAndUpdate(id,{title,content},{new:true})
       res.send(updatedPost)
    } catch (error) {
        res.status(400).send(err.message)
    }
})

router.delete('/:id',authenticate,async (req,res)=>{
    try {
       const {id} = req.params;
       await Post.findByIdAndDelete(id)
       res.send('post deleted successfully')
    } catch (error) {
        res.status(400).send(err.message)
    }
})

module.exports = router;
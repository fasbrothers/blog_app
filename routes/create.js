// third party libraries
const express = require('express');
const router = express.Router();
const { Validator } = require('node-input-validator');
const multer = require('multer')

// core libraries
const fs =require('fs')
const path = require('path')

// generate random id number
function id(){
    return '_' + Math.random().toString(36).substr(2,9);
}

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) =>{
        cb(null, id() + '.jpg');
    }
});

router.use(multer({ storage:storageConfig }).single("photo"));

router.get('/',(req, res) => {
    res.render('create-blog')
    })
router.post('/',(req, res) => {
        const title = req.body.title
        const author = req.body.author
        const description = req.body.description
        const photo = req.file.filename

        const v = new Validator(req.body, {
            title: 'required|minLength:5|maxLength:100',
            author: 'required|minLength:5|maxLength:25',
            description: 'required|minLength:5'
        });
        
        v.check().then((matched) => {
            if (!matched) {
                res.render('create-blog', {error: true})
            }
            else{
                fs.readFile('./data/blogs.json', (err,data)=>{
                    if(err) res.sendStatus(500)
                    
                    const blogs = JSON.parse(data)
                    blogs.push({
                        id: id(),
                        title: title,
                        author:author,
                        description:description,
                        photo: photo
                    }),
                    fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err=>{
                        if(err) res.sendStatus(500)
      
                        res.render('create-blog', {success:true})
                    })
                })

            }
            });
        
        }
    )

module.exports = router
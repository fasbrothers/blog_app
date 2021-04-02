// third party libraries
const express = require('express');
const app = express();
const multer = require('multer')
const { Validator } = require('node-input-validator');

// local library
const blogs = require('./routes/blogs')
const api_listOfBlogs = require('./routes/api')

// core libraries
const fs =require('fs')
const path = require('path')

// generate random id number
function id(){
    return '_' + Math.random().toString(36).substr(2,9);
}

//server config
const PORT = process.env.PORT || 5000

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) =>{
        cb(null, id() + '.jpg');
    }
});

//set view engine.
app.set('view engine', 'pug')

// middlewares
app.use(express.urlencoded({extended:false}))
app.use('/blogs', blogs)
app.use('/api/v1/blogs', api_listOfBlogs)
app.use('/static', express.static('public'))
app.use(multer({ storage:storageConfig }).single("photo"));

// url handlers 
app.get('/', (req, res) => {
    res.render('homepage')
})
app.route('/create')
    .get((req, res) => {
    res.render('create-blog')
    })
    .post((req, res) => {
        const title = req.body.title
        const author = req.body.author
        const description = req.body.description
        const photo = req.file.filename

        const v = new Validator(req.body, {
            title: 'required|minLength:5|maxLength:50',
            author: 'required|minLength:5|maxLength:20',
            description: 'required|minLength:5'
        });
        
        v.check().then((matched) => {
            if (!matched) {
                res.render('create-blog', {error:"Please fill all fields!"})
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

app.use(function(req, res, next){
    res.status(404).render("error")
})

// run server
app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
})

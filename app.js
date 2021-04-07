// third party libraries
const express = require('express');
const app = express();

// local libraries 
const blogs = require('./routes/blogs')
const api_listOfBlogs = require('./routes/api')
const create = require('./routes/create')

// core libraries
const fs =require('fs')
const path = require('path')

// generate random id number
function id(){
    return '_' + Math.random().toString(36).substr(2,9);
}

//server config
const PORT = process.env.PORT || 5000


//set view engine.
app.set('view engine', 'pug')

// middlewares
app.use(express.urlencoded({extended:false}))
app.use('/create', create)
app.use('/blogs', blogs)
app.use('/api/v1/blogs', api_listOfBlogs)
app.use('/static', express.static('public'))

// url handlers 
app.get('/', (req, res) => {
    res.render('homepage')
})

app.use(function(req, res, next){
    res.status(404).render("error")
})

// run server
app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
})

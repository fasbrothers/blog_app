// third party libraries
const express = require('express');
const router = express.Router();

// core library
const fs =require('fs')

// url handler
router.get('/', (req,res)=>{
    fs.readFile('./data/blogs.json', (err, data)=>{
        if (err) res.sendStatus(500)
        
        const blogs = JSON.parse(data)
        res.json(blogs)
        
    })
})

// export
module.exports = router

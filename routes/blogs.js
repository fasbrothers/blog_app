// third party libraries
const express = require('express');
const router = express.Router();

// core library
const fs =require('fs')

// url handlers 
router.get('/', (req, res) => {
    fs.readFile('./data/blogs.json', (err, data)=>{
        if (err) throw err

        const blogs = JSON.parse(data)
        res.render('blogs', { blogs: blogs })

    })

})
router.get('/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/blogs.json', (err, data)=>{
        if (err) throw err

        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog=>blog.id == id)[0]
        res.render('detail', {blog:blog})
    })
})
// export
module.exports = router

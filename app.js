const { throws } = require('assert');
const express = require('express');
const app = express();

const fs =require('fs')

app.set('view engine', 'pug')
app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
    res.render('homepage')
})
app.get('/create', (req, res) => {
    res.render('create-blog')
})
app.post('/create', (req, res) => {
    const title = req.body.title
    const author = req.body.author
    const description = req.body.description

    if(title.trim() === '' && author.trim() === '' && description.trim() === ''){
        res.render('create-blog', {error: true})
    }else{
        fs.readFile('./data/blogs.json', (err,data)=>{
            if(err) throw err
            
            const blogs = JSON.parse(data)

            blogs.push({
                id: id(),
                title:title,
                author:author,
                description:description
            })

            fs.writeFile('./data/blogs.json', JSON.stringify(blogs), err=>{
                if(err) throw err

                res.render('create-blog', {success:true})
            })
        })
    }
})


app.get('/blogs', (req, res) => {
    fs.readFile('./data/blogs.json', (err, data)=>{
        if (err) throw err

        const blogs = JSON.parse(data)
        res.render('blogs', { blogs: blogs })

    })

})
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/blogs.json', (err, data)=>{
        if (err) throw err

        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog=>blog.id == id)[0]
        res.render('detail', {blog:blog})
    })
})

app.listen(5000, () => {
    console.log('Server is runnig on port 5000');
})

function id(){
    return '_' + Math.random().toString(36).substr(2,9);
}
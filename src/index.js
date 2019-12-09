const path = require('path')
const express = require('express')

const app = express()

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// Routes of the pages being served
app.get('', (req, res) => {
  res.render('index', {
    title: 'Chat App'
  })
})

app.listen(port, () => {
  console.log('Server is on port ' + port + '.')
})

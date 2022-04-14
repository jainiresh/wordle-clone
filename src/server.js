const express = require('express');
require('dotenv').config();
const axios = require("axios");
const cors = require('cors');
const path = require('path');
// const hbs = require('hbs');

const PORT = 3000 || process.env.PORT;

const publicDirectoryPath = path.join(__dirname, '..', '/public');
// console.log('path : ' , publicDirectoryPath);

const app = express();

app.use(express.static(publicDirectoryPath));
app.use(cors());

// app.get('', (req, res)=>{
//     res.send();
// })

app.get('/word', (req, res)=>{

  const url = process.env.URL;
  axios.request(url)
  .then((data) => {
    console.log(data.data[0])
    res.json(data.data[0])})
  .catch(error => console.log(error));

})

app.get('/check', (req, res) => {

  const queryWord = req.query.word;
  const url = process.env.CHECK_URL + queryWord;

  axios.request(url)
  .then((data) =>{
    res.json({message : 'Found'})
  })
  .catch(e => res.json({message : 'Not Found'}));
})
app.listen(PORT, ()=>{
  console.log(`Server up on ${PORT}`);
})

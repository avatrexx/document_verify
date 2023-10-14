<<<<<<< HEAD
=======
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/uploadImages', upload.fields([{ name: 'frontImage', maxCount: 1 }, { name: 'backImage', maxCount: 1 }]), async (req, res) => {
  let data = qs.stringify({
    'type': 'document-validation',
    'country': 'CO',
    'document_type': 'national-id',
    'user_authorized': true
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.validations.truora.com/v1/validations',
    headers: {
      'Truora-API-Key': '', // replace with your API key
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.dir(response.data);

    const front = fs.readFileSync(req.files.frontImage[0].path);
    const back = fs.readFileSync(req.files.backImage[0].path);

    const response2 = await axios.request({
      method: 'put',
      url: response.data.instructions.front_url, 
      data: front, 
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.dir(response2.data);

    const response3 = await axios.request({
      method: 'put',
      url: response.data.instructions.reverse_url, 
      data: back, 
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log(response3.data);

    setTimeout(async function() {
      const response_final = await axios.request({
        method: 'get',
        url: `https://api.validations.truora.com/v1/validations/${response.data.validation_id}`,
        headers: {
          'Truora-API-Key': '', // replace with your API key
          'Accept': 'application/json'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      
      console.log(response_final.data);
      
      res.send(response_final.data);
      
    }, 5000);

  } catch (error) {
    console.dir(error);
    
    res.status(500).send(error);
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
>>>>>>> 03af5d5 (Initial commit)

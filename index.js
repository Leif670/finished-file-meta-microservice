var express = require('express');
var cors = require('cors');
require('dotenv').config()
const upload = require('./uploads');
const fileType = require('file-type');
const { error } = require('console');
const fs = require('fs').promises
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/upload',upload.single('upfile'),async (req, res)=>{
  const filepath = req.file.path;
  try{
  const stats = await fs.stat(filepath)
  const fileSizeInBytes = stats.size;
  const fileBuffer= await fs.readFile(req.file.path)
  const type = await fileType.fromBuffer(fileBuffer);
  const name = req.file.originalname
  const mimeType = type? type.mime : "unknown";
  res.json({name: name, type: mimeType, size: fileSizeInBytes })
  }catch(err){
    res.status(500).json({error: "Cannot Process File", details: error.message})
  }
})

const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});


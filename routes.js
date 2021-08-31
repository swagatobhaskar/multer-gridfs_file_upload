const app = require('express');
const router = app.Router();

const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');

const URI = process.env.mongoURI;

console.log(URI);

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const con = mongoose.createConnection(URI, options);

// Init gfs
let gfs;

con.once('open', () => {
    // Init stream
    gfs = Grid(con.db, mongoose.mongo);
    gfs.collection('uploads');
});
console.log("GFS: ", gfs);

// create storage engine
const storage = new GridFsStorage({
    url: URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('photo'), (req, res) => {
    // res.json({ file: req.file });
    res.send('success');
});

router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
      // Files exist
      return res.json(files);
    });
});

router.get('/:filename', (req, res) => {
	gfs.files.findOne({filename: req.params.filename}, (err, file) => {
		if (err) throw err;
		let readStream = gfs.createReadStream({filename: file.filename});
		/*
		let data = '';
		readStream.on('data', (chunk) => {
			data += chunk.toString('base64');
		})
		readStream.on("error", function (err) {
			res.send("Image not found");
		});
		*/
		readStream.pipe(res);
	})
})

module.exports = router;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const testRoutes = express.Router();
const PORT = 4000;
const multer = require('multer');
const path = require("path");

let SliceModel = require('./slice.model');
let WellModel = require('./well.model');
let ImageModel = require('./image.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/rex3d', { useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established succesfully");
})


testRoutes.route('/slices').get(function(req, res) {
    SliceModel.find(function(err, slices) {
        if (err) {
            console.log(err);
        } else {
            res.json(slices);
        }
    });
});

testRoutes.route('/slices/add').post(function(req, res) {
    let slice = new SliceModel(req.body);
    slice.save()
        .then(slice => {
            res.status(200).json({'slice': 'slice added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new slice failed');
        });
});

testRoutes.route('/wells').get(function(req, res) {
    WellModel.find(function(err, wells) {
        if (err) {
            console.log(err);
        } else {
            res.json(wells);
        }
    });
});

testRoutes.route('/wells/add').post(function(req, res) {
    let well = new WellModel(req.body);
    well.save()
        .then(well => {
            res.status(200).json({'well': 'well added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new well failed');
        });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // rejects storing a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

testRoutes.route('/images').get(function(req, res) {
    ImageModel.find(function(err, images) {
        if (err) {
            console.log(err);
        } else {
            res.json(images);
        }
    });
});

app.get("/images/image/:fileName", function(req, res) {
    const targetPath = path.join("./uploads", req.params.fileName);
    res.sendFile(targetPath, {root: __dirname})
})



testRoutes.route("/images/add")
    .post(upload.single('imageData'), (req, res, next) => {
        console.log(req.body);
        const newImage = new ImageModel({
            imageName: req.body.imageName,
            imageData: req.file.path
        });

        newImage.save()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    success: true,
                    document: result
                });
            })
            .catch((err) => next(err));
});

app.use('/rex3d', testRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, function() {
    console.log("Server is running on Portl: " + PORT);
});
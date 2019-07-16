const express = require("express");
const app = express();

app.use(express.static("./public"));
const db = require("./utils/db");
const s3 = require("./s3");
const config = require("./config");

/////////// for stroing uploaded file ///////////
var multer = require("multer"); //saving files to your harddrive
var uidSafe = require("uid-safe");
var path = require("path"); //
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
/////////// END: for stroing uploaded file ///////////
//uploader.single RUNS all the boilerplate code from above. It takes the file it got from formData, changes its name, and stores it in the /upload directory
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    const url = config.s3Url + req.file.filename;
    console.log("req.file: ", req.file);
    console.log("this is url: ", url);
    console.log("username: ", req.body.username);
    db.addImgurlInfos(
        url,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then(result => {
            console.log("success in adding data!", result);
        })
        .catch(err => {
            console.log(err);
        });
    if (req.file) {
        res.json({
            url,
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});
app.get("/images", function(req, res) {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(8080, () => console.log("Listening!!!"));

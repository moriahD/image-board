const express = require("express");
const app = express();

app.use(express.static("./public"));
const db = require("./utils/db");

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
app.post("/upload", uploader.single("file"), function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    // uploader.single, when successful, adds a property called "file" to the request object, "file" represents the file that was just uploaded to /upload
    console.log("req.file: ", req.file);
    if (req.file) {
        res.json({
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

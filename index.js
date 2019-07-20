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
app.use(require("body-parser").json());
//uploader.single RUNS all the boilerplate code from above. It takes the file it got from formData, changes its name, and stores it in the /upload directory
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
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
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.log(err);
        });
    // if (req.file) {
    //     res.json({
    //         url,
    //         success: true
    //     });
    // } else {
    //     res.json({
    //         success: false
    //     });
    // }
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

app.get("/images/oldestId", function(req, res) {
    db.oldestImageId()
        .then(result => {
            res.json(result.rows);
        })
        .catch();
});
app.get("/images/:lastImageId", function(req, res) {
    db.getMoreImages(req.params.lastImageId)
        .then(rows => {
            res.json(rows);
        })
        .catch();
});

app.get("/image/:id", function(req, res) {
    db.getInfoById(req.params.id) //i have to pass id here
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("error in getting img info by id", err);
        });
});
app.get("/getcomments/:id", (req, res) => {
    db.getCommentsById(req.params.id)
        .then(comments => {
            res.json(comments);
        })
        .catch(err =>
            console.log("error in db getCommentsById: ", err.message)
        );
});
app.post("/comments", function(req, res) {
    console.log("req.body in comment: ", req.body);

    db.addCommentInfo(
        req.body.image_id,
        req.body.commentername,
        req.body.comment_text
    )
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("error in addCommentInfo", err);
        });
});

app.listen(8080, () => console.log("Listening!!!"));

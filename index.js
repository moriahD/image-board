const express = require("express");
const app = express();

app.use(express.static("./public"));
const db = require("./utils/db");

app.get("/images", function(req, res) {
    db.getImages()
        .then(results => {
            res.json(results.rows);
        })
        .catch();
});

app.listen(8080, () => console.log("Listening!!!"));

var spicedPg = require("spiced-pg");
var db;
const limit = 12;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:moriah:1234@localhost:5432/imageboard");
}

exports.getImages = function getImages() {
    return db.query(`select * from images ORDER BY id DESC LIMIT ` + limit);
};

// inserting image and rest of info when user uploads new image
exports.addImgurlInfos = function addImgurlInfos(
    url,
    username,
    title,
    description
) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, username, title, description]
    );
};
// getting all information through id
exports.getInfoById = function getInfoById(id) {
    return db.query("SELECT * FROM images WHERE id=$1", [id]);
};

// inserting comment data
exports.addCommentInfo = function addCommentInfo(
    image_id,
    commentername,
    comment_text
) {
    return db.query(
        `INSERT INTO comments (image_id, commentername, comment_text)
    VALUES ($1, $2, $3) RETURNING *`,
        [image_id, commentername, comment_text]
    );
};
exports.getCommentsById = function getCommentsById(image_id) {
    return db.query(
        `
        SELECT * FROM comments WHERE image_id=$1`,
        [image_id]
    );
};

exports.getMoreImages = lastId =>
    db
        .query(
            `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT ` + limit,
            [lastId]
        )
        .then(({ rows }) => rows);

exports.oldestImageId = function oldestImageId() {
    return db
        .query(
            `SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1;`
        )
        .then()
        .catch(err => {
            console.log(err);
        });
};
//subquery
// SELECT id, (FROM images
// ORDER BY id ASC
// LIMIT 1
// ) AS "lowesId" FROM images
// WHERE id < 10
// ORDER BY id DESC
// LIMIT 20;

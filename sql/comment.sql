-- comment data table
DROP TABLE IF EXISTS comment;

CREATE TABLE comment(
    id SERIAL PRIMARY KEY,
    image_id INT,
    commentername VARCHAR(255),
    comment_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

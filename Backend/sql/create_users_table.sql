-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Update donor table to reference users
ALTER TABLE donor ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id);

-- Update ngo table to reference users
ALTER TABLE ngo ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id);

-- Update driver table to reference users
ALTER TABLE driver ADD COLUMN user_id INT, ADD FOREIGN KEY (user_id) REFERENCES users(id);

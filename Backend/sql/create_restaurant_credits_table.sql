-- Restaurant Credits table (updated)
CREATE TABLE restaurant_credits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donorid VARCHAR(255) NOT NULL,
    total_credits INT DEFAULT 0,
    total_donations INT DEFAULT 0
);

-- Food Requests table (updated)
CREATE TABLE food_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    restaurant VARCHAR(255) NOT NULL,
    food_item VARCHAR(255) NOT NULL,
    food_amount VARCHAR(100) NOT NULL,
    requested_person VARCHAR(255) NOT NULL
);

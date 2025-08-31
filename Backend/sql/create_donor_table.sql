-- Donor table for FoodSaver Lanka
CREATE TABLE donor (
    id VARCHAR(10) PRIMARY KEY,
    restaurant_id VARCHAR(10),
    google_location VARCHAR(200),
    address VARCHAR(100)
);

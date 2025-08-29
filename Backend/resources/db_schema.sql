-- Database schema for FoodSaver Lanka
-- Create database and tables for user registration

CREATE DATABASE IF NOT EXISTS foodsaver_db;
USE foodsaver_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donor orders table
CREATE TABLE IF NOT EXISTS donor_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    donor_restaurant VARCHAR(255) NOT NULL,
    donated_item VARCHAR(255) NOT NULL,
    donated_amount VARCHAR(100) NOT NULL, -- e.g., "50 kg", "200 ml"
    delivered_person VARCHAR(255),
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Food requests table
CREATE TABLE IF NOT EXISTS food_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    restaurant VARCHAR(255) NOT NULL,
    food_item VARCHAR(255) NOT NULL,
    food_amount VARCHAR(100) NOT NULL, -- e.g., "50 kg", "200 ml"
    requested_person VARCHAR(255) NOT NULL,
    FOREIGN KEY (request_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Restaurant credits table
CREATE TABLE IF NOT EXISTS restaurant_credits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_name VARCHAR(255) NOT NULL UNIQUE,
    total_credits INT DEFAULT 0,
    total_donations INT DEFAULT 0
);

-- NGO supplies table
CREATE TABLE IF NOT EXISTS ngo_supplies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id VARCHAR(100) NOT NULL UNIQUE,
    restaurant_name VARCHAR(255) NOT NULL,
    container_type VARCHAR(100) NOT NULL, -- e.g., "Plastic Container", "Soup Cup", "Food Tray"
    number_of_containers INT NOT NULL,
    supplied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Delivery drivers table
CREATE TABLE IF NOT EXISTS delivery_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE,
    vehicle_type VARCHAR(100) NOT NULL, -- e.g., "Bike", "Car", "Van", "Truck"
    license_number VARCHAR(100) NOT NULL,
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_deliveries INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    driver_id INT,
    ngo_id INT NOT NULL,
    requester_id INT NOT NULL,
    restaurant_name VARCHAR(255) NOT NULL,
    food_item VARCHAR(255) NOT NULL,
    food_amount VARCHAR(100) NOT NULL,
    pickup_location VARCHAR(500) NOT NULL,
    delivery_location VARCHAR(500) NOT NULL,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    status VARCHAR(50) DEFAULT 'pending',
    estimated_delivery_time TIMESTAMP NULL,
    actual_delivery_time TIMESTAMP NULL,
    delivery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES delivery_drivers(id) ON DELETE SET NULL
);

-- Index for faster lookups
CREATE INDEX idx_username ON users (username);
CREATE INDEX idx_donor_id ON donor_orders (donor_id);
CREATE INDEX idx_request_id ON food_requests (request_id);
CREATE INDEX idx_restaurant_name ON restaurant_credits (restaurant_name);
CREATE INDEX idx_ngo_stock_id ON ngo_supplies (stock_id);
CREATE INDEX idx_ngo_restaurant ON ngo_supplies (restaurant_name);
CREATE INDEX idx_total_credits ON restaurant_credits (total_credits DESC);

-- Driver system indexes
CREATE INDEX idx_driver_available ON delivery_drivers (is_available);
CREATE INDEX idx_driver_vehicle ON delivery_drivers (vehicle_type);

-- Delivery indexes
CREATE INDEX idx_delivery_status ON deliveries (status);
CREATE INDEX idx_delivery_driver ON deliveries (driver_id);
CREATE INDEX idx_delivery_order ON deliveries (order_id);

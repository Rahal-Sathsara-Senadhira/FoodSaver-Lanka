-- FoodSaver Lanka Database Schema - Updated
-- Run this script in MySQL Workbench to create all necessary tables with simplified driver structure

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS foodsaver_db;
USE foodsaver_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donor_orders table
CREATE TABLE IF NOT EXISTS donor_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    donor_restaurant VARCHAR(255) NOT NULL,
    donated_item VARCHAR(255) NOT NULL,
    donated_amount VARCHAR(100) NOT NULL, -- e.g., "50 kg", "200 ml"
    delivered_person VARCHAR(255),
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create food_requests table
CREATE TABLE IF NOT EXISTS food_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    restaurant VARCHAR(255) NOT NULL,
    food_item VARCHAR(255) NOT NULL,
    food_amount VARCHAR(100) NOT NULL, -- e.g., "50 kg", "200 ml"
    requested_person VARCHAR(255) NOT NULL,
    FOREIGN KEY (request_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create restaurant_credits table
CREATE TABLE IF NOT EXISTS restaurant_credits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_name VARCHAR(255) NOT NULL UNIQUE,
    total_credits INT DEFAULT 0,
    total_donations INT DEFAULT 0
);

-- Create ngo_supplies table
CREATE TABLE IF NOT EXISTS ngo_supplies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id VARCHAR(100) NOT NULL UNIQUE,
    restaurant_name VARCHAR(255) NOT NULL,
    container_type VARCHAR(100) NOT NULL, -- e.g., "Plastic Container", "Soup Cup", "Food Tray"
    number_of_containers INT NOT NULL,
    supplied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create delivery_drivers table (simplified)
CREATE TABLE IF NOT EXISTS delivery_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE,
    vehicle_type VARCHAR(100) NOT NULL, -- e.g., "Bike", "Car", "Van", "Truck"
    start_location VARCHAR(500) NOT NULL, -- Starting point for delivery
    destination VARCHAR(500) NOT NULL, -- Destination for delivery
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Show success message
SELECT 'All tables created successfully in foodsaver_db database with simplified driver structure' AS status;

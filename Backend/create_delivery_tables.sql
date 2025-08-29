-- FoodSaver Lanka - Delivery System Tables
-- Run this script to add delivery system tables to existing database

USE foodsaver_db;

-- Create delivery_drivers table
CREATE TABLE IF NOT EXISTS delivery_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE,
    vehicle_type VARCHAR(100) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_deliveries INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create deliveries table
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
    status ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    delivery_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES delivery_drivers(id) ON DELETE SET NULL,
    FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create delivery system indexes
CREATE INDEX IF NOT EXISTS idx_driver_available ON delivery_drivers (is_available);
CREATE INDEX IF NOT EXISTS idx_driver_location ON delivery_drivers (current_location_lat, current_location_lng);
CREATE INDEX IF NOT EXISTS idx_delivery_status ON deliveries (status);
CREATE INDEX IF NOT EXISTS idx_delivery_driver ON deliveries (driver_id);
CREATE INDEX IF NOT EXISTS idx_delivery_ngo ON deliveries (ngo_id);
CREATE INDEX IF NOT EXISTS idx_delivery_requester ON deliveries (requester_id);
CREATE INDEX IF NOT EXISTS idx_delivery_created ON deliveries (created_at DESC);

-- Insert sample delivery drivers for testing
INSERT INTO delivery_drivers (driver_name, phone_number, email, vehicle_type, license_number, current_location_lat, current_location_lng) VALUES
('John Smith', '+94771234567', 'john.smith@email.com', 'Bike', 'DL123456', 6.9271, 79.8612),
('Sarah Johnson', '+94772345678', 'sarah.j@email.com', 'Car', 'DL234567', 6.9271, 79.8612),
('Mike Wilson', '+94773456789', 'mike.w@email.com', 'Van', 'DL345678', 6.9271, 79.8612),
('Emma Davis', '+94774567890', 'emma.d@email.com', 'Bike', 'DL456789', 6.9271, 79.8612),
('Alex Brown', '+94775678901', 'alex.b@email.com', 'Car', 'DL567890', 6.9271, 79.8612);

SELECT 'Delivery system tables created successfully!' AS status;
SELECT COUNT(*) as total_drivers FROM delivery_drivers;
SELECT COUNT(*) as total_deliveries FROM deliveries;

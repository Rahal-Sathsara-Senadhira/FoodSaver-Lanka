-- Driver table with address foreign key
CREATE TABLE driver (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARBINARY(10),
    last_name VARCHAR(10),
    vehicle_type VARCHAR(10),
    vehicle_number VARCHAR(10),
    age INT,
    phone_number VARCHAR(10),
    email VARCHAR(20),
    NIC VARCHAR(15),
    address_street INT,
    FOREIGN KEY (address_street) REFERENCES address(street)
);

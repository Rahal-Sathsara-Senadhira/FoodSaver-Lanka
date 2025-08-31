-- NGO table with address foreign key
CREATE TABLE ngo (
    ngo_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    email VARCHAR(20) NOT NULL,
    contact_no VARCHAR(15) NOT NULL,
    contact_name VARCHAR(20),
    address_street INT,
    FOREIGN KEY (address_street) REFERENCES address(street)
);

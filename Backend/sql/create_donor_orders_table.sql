-- Donor Orders table (updated)
CREATE TABLE donor_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    donor_restaurant VARCHAR(255) NOT NULL,
    donated_item VARCHAR(255) NOT NULL,
    donated_amount VARCHAR(100) NOT NULL,
    delivered_person VARCHAR(255),
    FOREIGN KEY (donor_id) REFERENCES donor(id)
);

CREATE INDEX idx_donor_id ON donor_orders (donor_id);

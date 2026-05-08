CREATE DATABASE IF NOT EXISTS maghreb_validator;
USE maghreb_validator;

CREATE TABLE IF NOT EXISTS phone_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(25) NOT NULL,
    status VARCHAR(20) NOT NULL, 
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
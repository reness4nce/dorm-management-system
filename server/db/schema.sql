
-- Create database (run this separately)
-- CREATE DATABASE algcit_dorm;

-- Connect to database
\c algcit_dorm;

-- Drop tables if they exist
DROP TABLE IF EXISTS clearance_items;
DROP TABLE IF EXISTS checkout_forms;
DROP TABLE IF EXISTS residents;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create residents table
CREATE TABLE residents (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(255) UNIQUE NOT NULL,
  strand VARCHAR(255) NOT NULL,
  grade_level VARCHAR(10) NOT NULL,
  contact_number VARCHAR(255) NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  checkout_status VARCHAR(50) DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create checkout forms table
CREATE TABLE checkout_forms (
  id SERIAL PRIMARY KEY,
  resident_id INTEGER REFERENCES residents(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  intended_date DATE NOT NULL,
  intended_time TIME NOT NULL,
  return_date DATE,
  return_time TIME,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by VARCHAR(255),
  approval_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create clearance items table
CREATE TABLE clearance_items (
  id SERIAL PRIMARY KEY,
  checkout_form_id INTEGER REFERENCES checkout_forms(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by VARCHAR(255),
  completed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_residents_student_id ON residents(student_id);
CREATE INDEX idx_checkout_forms_resident_id ON checkout_forms(resident_id);
CREATE INDEX idx_checkout_forms_status ON checkout_forms(status);
CREATE INDEX idx_clearance_items_checkout_form_id ON clearance_items(checkout_form_id);

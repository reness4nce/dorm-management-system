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
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create residents table
CREATE TABLE residents (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  student_id TEXT UNIQUE NOT NULL,
  strand TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  room_number TEXT NOT NULL,
  checkout_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
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
  submission_date TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending',
  approved_by TEXT,
  approval_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create clearance items table
CREATE TABLE clearance_items (
  id SERIAL PRIMARY KEY,
  checkout_form_id INTEGER REFERENCES checkout_forms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by TEXT,
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_residents_student_id ON residents(student_id);
CREATE INDEX idx_checkout_forms_resident_id ON checkout_forms(resident_id);
CREATE INDEX idx_checkout_forms_status ON checkout_forms(status);
CREATE INDEX idx_clearance_items_checkout_form_id ON clearance_items(checkout_form_id);

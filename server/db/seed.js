const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL, // Use Neon-specific connection string
  ssl: {
    rejectUnauthorized: false // Ensure SSL is enabled for Neon
  }
});

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (username, password, role, first_name, last_name, email)
      VALUES ('admin', $1, 'admin', 'Admin', 'User', 'admin@algcit.edu')
      ON CONFLICT (username) DO NOTHING;
    `, [hashedPassword]);
    
    // Create staff user
    const staffPassword = await bcrypt.hash('staff123', 10);
    await pool.query(`
      INSERT INTO users (username, password, role, first_name, last_name, email)
      VALUES ('staff', $1, 'staff', 'Staff', 'User', 'staff@algcit.edu')
      ON CONFLICT (username) DO NOTHING;
    `, [staffPassword]);

    // Create sample residents
    const residents = [
      { firstName: 'John', lastName: 'Doe', studentId: '2023001', strand: 'Instrumentation', gradeLevel: '11', contactNumber: '09123456789', roomNumber: 'A101' },
      { firstName: 'Jane', lastName: 'Smith', studentId: '2023002', strand: 'Mechatronics', gradeLevel: '12', contactNumber: '09234567890', roomNumber: 'B202' },
      { firstName: 'Michael', lastName: 'Johnson', studentId: '2023003', strand: 'Machining', gradeLevel: '11', contactNumber: '09345678901', roomNumber: 'C303' }
    ];

    for (const resident of residents) {
      await pool.query(`
        INSERT INTO residents (first_name, last_name, student_id, strand, grade_level, contact_number, room_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (student_id) DO NOTHING;
      `, [
        resident.firstName, 
        resident.lastName, 
        resident.studentId, 
        resident.strand, 
        resident.gradeLevel, 
        resident.contactNumber, 
        resident.roomNumber
      ]);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
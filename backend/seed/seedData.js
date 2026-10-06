const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Gig = require('../src/models/Gig');
const Booking = require('../src/models/Booking');
const connectDB = require('../src/config/Exp11_db');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
connectDB();

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Gig.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const users = [
      { name: 'Alice Smith', email: 'alice@campus.edu', passwordHash, skillsOffered: ['Tutoring', 'Writing'], rating: 4.8 },
      { name: 'Bob Jones', email: 'bob@campus.edu', passwordHash, skillsOffered: ['Photography', 'Design'], rating: 4.5 },
      { name: 'Charlie Brown', email: 'charlie@campus.edu', passwordHash, skillsOffered: ['Coding', 'Tech Support'], rating: 4.9 },
    ];

    const createdUsers = await User.insertMany(users);
    const u1 = createdUsers[0]._id;
    const u2 = createdUsers[1]._id;
    const u3 = createdUsers[2]._id;

    const gigs = [
      { title: 'Math Tutoring', description: 'Calculus and Algebra tutoring.', category: 'Tutoring', price: 20, durationMinutes: 60, location: 'Library', availability: 'Mon-Wed Evenings', owner: u1 },
      { title: 'Essay Proofreading', description: 'I will proofread your essays.', category: 'Writing', price: 15, durationMinutes: 30, location: 'Online', availability: 'Weekends', owner: u1 },
      { title: 'Portrait Photography', description: 'Professional portrait photos.', category: 'Photography', price: 50, durationMinutes: 120, location: 'Campus Park', availability: 'Weekends', owner: u2 },
      { title: 'Logo Design', description: 'I will design a logo for your club.', category: 'Design', price: 40, durationMinutes: 120, location: 'Online', availability: 'Anytime', owner: u2 },
      { title: 'React Native Help', description: 'I can help you build your Expo app.', category: 'Coding', price: 25, durationMinutes: 60, location: 'Tech Lab', availability: 'Tue/Thu Afternoons', owner: u3 },
      { title: 'PC Build Help', description: 'Need help building a PC?', category: 'Tech Support', price: 30, durationMinutes: 120, location: 'Your Dorm', availability: 'Weekends', owner: u3 },
      { title: 'Chemistry Tutoring', description: 'Help with general chemistry.', category: 'Tutoring', price: 22, durationMinutes: 60, location: 'Library', availability: 'Mon/Wed', owner: u1 },
      { title: 'Resume Review', description: 'I will review and fix your resume.', category: 'Writing', price: 10, durationMinutes: 30, location: 'Online', availability: 'Anytime', owner: u1 },
      { title: 'Event Photography', description: 'Photos for your club event.', category: 'Photography', price: 100, durationMinutes: 240, location: 'Campus', availability: 'Friday nights', owner: u2 },
      { title: 'Flyer Design', description: 'Flyers for events.', category: 'Design', price: 15, durationMinutes: 60, location: 'Online', availability: 'Mon-Fri', owner: u2 },
      { title: 'Python Scripting', description: 'I will write Python scripts for you.', category: 'Coding', price: 30, durationMinutes: 60, location: 'Online', availability: 'Weekends', owner: u3 },
      { title: 'Virus Removal', description: 'I will clean your laptop.', category: 'Tech Support', price: 20, durationMinutes: 60, location: 'Library', availability: 'Anytime', owner: u3 },
      { title: 'Physics Tutoring', description: 'Physics 101 help.', category: 'Tutoring', price: 25, durationMinutes: 60, location: 'Library', availability: 'Tue/Thu', owner: u1 },
      { title: 'Creative Writing', description: 'Help with creative writing assignments.', category: 'Writing', price: 20, durationMinutes: 60, location: 'Online', availability: 'Weekends', owner: u1 },
      { title: 'Headshots', description: 'LinkedIn headshots.', category: 'Photography', price: 30, durationMinutes: 30, location: 'Campus Park', availability: 'Weekends', owner: u2 },
    ];

    await Gig.insertMany(gigs);

    console.log('Data Imported!');
    console.log('--- Demo Credentials ---');
    console.log('Alice: alice@campus.edu / password123');
    console.log('Bob: bob@campus.edu / password123');
    console.log('Charlie: charlie@campus.edu / password123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();

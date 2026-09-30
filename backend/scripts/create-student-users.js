const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const User = require('../models/User');
const Student = require('../models/Student');
const config = require('../config/config');

async function createUserAccountsForStudents() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Get all students
        const students = await Student.find({});
        console.log(`📊 Found ${students.length} students in database\n`);

        let created = 0;
        let updated = 0;
        let errors = 0;

        for (const student of students) {
            try {
                // Check if User account already exists
                let user = await User.findOne({ email: student.email.toLowerCase() });

                if (user) {
                    user.fullName = student.fullName;
                    user.role = 'student';
                    user.isActive = true;
                    user.password = 'Student@123';
                    await user.save();
                    console.log(`🔄 Updated password to Student@123: ${student.fullName} (${student.email})`);
                    updated++;
                } else {
                    // Create User account with Student@123
                    user = new User({
                        fullName: student.fullName,
                        email: student.email.toLowerCase(),
                        password: 'Student@123',
                        role: 'student',
                        isActive: true
                    });

                    await user.save();
                    console.log(`✅ Created: ${student.fullName} (${student.email}) - Password: Student@123`);
                    created++;
                }
            } catch (error) {
                console.error(`❌ Error with student ${student.fullName}: ${error.message}`);
                errors++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📈 Summary:');
        console.log(`   ✅ Created: ${created} user accounts`);
        console.log(`   🔄 Updated: ${updated} user accounts`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log('='.repeat(60));
        console.log('\n🎉 Completed!');
        console.log('🔑 All students can now login with password: Student@123\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

createUserAccountsForStudents();

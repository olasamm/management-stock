const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Import models
const User = require("./models/userModel");
const Company = require("./models/Company");
const TeamMember = require("./models/TeamMember");

const testDatabase = async () => {
    try {
        console.log("Testing database connection...");
        
        // Connect to MongoDB
        await mongoose.connect(process.env.URI);
        console.log("✅ Connected to MongoDB");
        
        // Test 1: Check if we can create a test user
        console.log("\n🧪 Test 1: Creating test user...");
        const testUser = new User({
            firstName: "Test",
            lastName: "User",
            mail: "test@example.com",
            password: "testpass123",
            confirmPassword: "testpass123"
        });
        
        const savedUser = await testUser.save();
        console.log("✅ Test user created:", savedUser._id);
        
        // Test 2: Check if we can retrieve the user
        console.log("\n🧪 Test 2: Retrieving test user...");
        const retrievedUser = await User.findById(savedUser._id);
        console.log("✅ Test user retrieved:", retrievedUser ? "SUCCESS" : "FAILED");
        
        // Test 3: Check if we can create a test company
        console.log("\n🧪 Test 3: Creating test company...");
        const testCompany = new Company({
            companyName: "Test Company",
            industry: "Technology",
            companyEmail: "company@test.com",
            verificationToken: "test123",
            verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isVerified: true,
            status: 'active'
        });
        
        const savedCompany = await testCompany.save();
        console.log("✅ Test company created:", savedCompany._id);
        
        // Test 4: Check if we can create a test team member
        console.log("\n🧪 Test 4: Creating test team member...");
        const testTeamMember = new TeamMember({
            firstName: "Test",
            lastName: "Member",
            email: "member@test.com",
            companyId: savedCompany._id,
            invitationToken: "invite123",
            invitationExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        
        const savedTeamMember = await testTeamMember.save();
        console.log("✅ Test team member created:", savedTeamMember._id);
        
        // Test 5: Check if we can retrieve team members for the company
        console.log("\n🧪 Test 5: Retrieving team members...");
        const teamMembers = await TeamMember.find({ companyId: savedCompany._id });
        console.log("✅ Team members found:", teamMembers.length);
        
        // Test 6: Clean up test data
        console.log("\n🧹 Cleaning up test data...");
        await User.findByIdAndDelete(savedUser._id);
        await Company.findByIdAndDelete(savedCompany._id);
        await TeamMember.findByIdAndDelete(savedTeamMember._id);
        console.log("✅ Test data cleaned up");
        
        console.log("\n🎉 All database tests passed!");
        
    } catch (error) {
        console.error("❌ Database test failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
};

testDatabase();

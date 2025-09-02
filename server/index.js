const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
dotenv.config();

// Import models
const User = require("./models/userModel");
const Company = require("./models/Company");
const TeamMember = require("./models/TeamMember");
const StockItem = require("./models/StockItem");
const Category = require("./models/Category");

// Import email service
const { sendTeamInvitation, sendWelcomeEmail } = require("./utils/emailService");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 1002;
const URI = process.env.URI;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// MongoDB connection
mongoose.connect(URI).then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log("Error connecting to MongoDB", err);
    console.error("MongoDB connection error details:", {
        message: err.message,
        code: err.code,
        name: err.name
    });
});

// Helper function to generate invitation token
const generateInvitationToken = () => {
    return jwt.sign(
        { type: 'team-invitation', timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Helper function to verify invitation token
const verifyInvitationToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Signup endpoint
app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ mail: email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        
        // Create new user
        const user = new User({
            firstName,
            lastName,
            mail: email,
            password,
            confirmPassword
        });
        
        await user.save();
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.mail
            }
        });
        
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Signin endpoint
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Find user by email
        const user = await User.findOne({ mail: email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Send success response
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.mail
            }
        });
        
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Admin Signup endpoint
app.post("/admin/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, adminCode } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !adminCode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        // Check admin authorization code
        if (adminCode !== 'ADMIN2024') {
            return res.status(400).json({ message: "Invalid admin authorization code" });
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ mail: email, role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        // Create new admin user
        const admin = new User({
            firstName,
            lastName,
            mail: email,
            password,
            confirmPassword,
            role: 'admin'
        });

        await admin.save();

        res.status(201).json({
            message: "Admin account created successfully",
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.mail,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Admin signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Admin Signin endpoint
app.post("/admin/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find admin by email and role
        const admin = await User.findOne({ mail: email, role: 'admin' });
        if (!admin) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Check if password matches
        if (admin.password !== password) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Send success response
        res.status(200).json({
            message: "Admin login successful",
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.mail,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Admin signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Company Registration endpoint
app.post("/company/register", async (req, res) => {
    try {
        console.log("Company registration request received:", req.body);
        
        const {
            companyName,
            industry,
            companyEmail,
            companyPhone,
            website,
            adminFirstName,
            adminLastName,
            adminEmail,
            adminPassword,
            confirmPassword
        } = req.body;

        // Validation
        if (!companyName || !industry || !companyEmail || !adminFirstName || 
            !adminLastName || !adminEmail || !adminPassword || !confirmPassword) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        if (adminPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (adminPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if company email already exists
        const existingCompany = await Company.findOne({ companyEmail });
        if (existingCompany) {
            return res.status(400).json({ message: "Company with this email already exists" });
        }

        // Check if admin email already exists
        const existingUser = await User.findOne({ mail: adminEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Admin email already exists" });
        }

        // Create company
        const company = new Company({
            companyName,
            industry,
            companyEmail,
            companyPhone,
            website,
            verificationToken: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });

        console.log("Company object created:", company);
        await company.save();
        console.log("Company saved successfully with ID:", company._id);

        // Create company admin user
        const adminUser = new User({
            firstName: adminFirstName,
            lastName: adminLastName,
            mail: adminEmail,
            password: adminPassword,
            confirmPassword,
            role: 'company_admin',
            companyId: company._id
        });

        console.log("Admin user object created:", adminUser);
        await adminUser.save();
        console.log("Admin user saved successfully with ID:", adminUser._id);

        // TODO: Send verification email here
        // For now, we'll auto-verify the company
        company.isVerified = true;
        company.status = 'active';
        await company.save();

        res.status(201).json({
            message: "Company registered successfully",
            company: {
                id: company._id,
                companyName: company.companyName,
                industry: company.industry,
                companyEmail: company.companyEmail
            },
            admin: {
                id: adminUser._id,
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                email: adminUser.mail,
                role: adminUser.role
            }
        });

    } catch (error) {
        console.error("Company registration error:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
});

// Company login endpoint
app.post("/company-login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Find user by email with company_admin role
        const adminUser = await User.findOne({ 
            mail: email, 
            role: 'company_admin' 
        }).populate('companyId');
        
        if (!adminUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Check if password matches
        if (adminUser.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Check if company is verified and active
        if (!adminUser.companyId || !adminUser.companyId.isVerified || adminUser.companyId.status !== 'active') {
            return res.status(401).json({ message: "Company account is not verified or active" });
        }
        
        // Generate simple token (in production, use JWT)
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        res.status(200).json({
            message: "Login successful",
            token: token,
            companyAdmin: {
                id: adminUser._id,
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                email: adminUser.mail,
                role: adminUser.role,
                companyId: adminUser.companyId._id,
                companyName: adminUser.companyId.companyName
            }
        });
        
    } catch (error) {
        console.error("Company login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Stock Management Endpoints

// Get stock items for a company
app.get("/stock-items/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        
        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Get stock items
        const stockItems = await StockItem.find({ companyId })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Stock items retrieved successfully",
            stockItems
        });
        
    } catch (error) {
        console.error("Get stock items error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add new stock item
app.post("/stock-items", async (req, res) => {
    try {
        const { name, category, subcategory, quantity, price, image, companyId } = req.body;
        
        // Validation
        if (!name || !category || !subcategory || !quantity || !price || !companyId) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        
        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Determine status based on quantity
        let status = 'In Stock';
        if (quantity === 0) {
            status = 'Out of Stock';
        } else if (quantity <= 20) {
            status = 'Low Stock';
        }
        
        // Create stock item
        const stockItem = new StockItem({
            name,
            category,
            subcategory,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            image: image || 'https://via.placeholder.com/50x50',
            companyId,
            status
        });
        
        await stockItem.save();
        
        res.status(201).json({
            message: "Stock item added successfully",
            stockItem
        });
        
    } catch (error) {
        console.error("Add stock item error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update stock item
app.put("/stock-items/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, subcategory, quantity, price, image } = req.body;
        
        // Validation
        if (!name || !category || !subcategory || !quantity || !price) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        
        // Find and update stock item
        const stockItem = await StockItem.findById(id);
        if (!stockItem) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        
        // Determine status based on quantity
        let status = 'In Stock';
        if (quantity === 0) {
            status = 'Out of Stock';
        } else if (quantity <= 20) {
            status = 'Low Stock';
        }
        
        stockItem.name = name;
        stockItem.category = category;
        stockItem.subcategory = subcategory;
        stockItem.quantity = parseInt(quantity);
        stockItem.price = parseFloat(price);
        stockItem.image = image || stockItem.image;
        stockItem.status = status;
        
        await stockItem.save();
        
        res.status(200).json({
            message: "Stock item updated successfully",
            stockItem
        });
        
    } catch (error) {
        console.error("Update stock item error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete stock item
app.delete("/stock-items/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete stock item
        const stockItem = await StockItem.findByIdAndDelete(id);
        if (!stockItem) {
            return res.status(404).json({ message: "Stock item not found" });
        }
        
        res.status(200).json({
            message: "Stock item deleted successfully",
            stockItem
        });
        
    } catch (error) {
        console.error("Delete stock item error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Category Management Endpoints

// Get categories for a company
app.get("/categories/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        
        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Get categories
        const categories = await Category.find({ companyId })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Categories retrieved successfully",
            categories
        });
        
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add new category
app.post("/categories", async (req, res) => {
    try {
        const { name, description, subcategories, companyId } = req.body;
        
        // Validation
        if (!name || !companyId) {
            return res.status(400).json({ message: "Category name and company ID are required" });
        }
        
        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Check if category already exists for this company
        const existingCategory = await Category.findOne({ name, companyId });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists for this company" });
        }
        
        // Create category
        const category = new Category({
            name,
            description: description || '',
            subcategories: subcategories || [],
            companyId
        });
        
        await category.save();
        
        res.status(201).json({
            message: "Category added successfully",
            category
        });
        
    } catch (error) {
        console.error("Add category error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update category
app.put("/categories/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, subcategories } = req.body;
        
        // Validation
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        
        // Find and update category
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        category.name = name;
        category.description = description || category.description;
        category.subcategories = subcategories || category.subcategories;
        
        await category.save();
        
        res.status(200).json({
            message: "Category updated successfully",
            category
        });
        
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete category
app.delete("/categories/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete category
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        // Also delete all stock items in this category
        await StockItem.deleteMany({ 
            companyId: category.companyId, 
            category: category.name 
        });
        
        res.status(200).json({
            message: "Category and related stock items deleted successfully",
            category
        });
        
    } catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Team Management Endpoints

// Invite team member
app.post("/invite-team-member", async (req, res) => {
    try {
        const { firstName, lastName, email, companyId } = req.body;
        
        // Validation
        if (!firstName || !lastName || !email || !companyId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Check if team member already exists
        const existingMember = await TeamMember.findOne({ email, companyId });
        if (existingMember) {
            return res.status(400).json({ message: "Team member with this email already exists" });
        }
        
        // Generate invitation token
        const invitationToken = generateInvitationToken();
        const invitationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        // Create team member
        const teamMember = new TeamMember({
            firstName,
            lastName,
            email,
            companyId,
            invitationToken,
            invitationExpires
        });
        
        await teamMember.save();
        
        // Generate invitation link
        const invitationLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/accept-invitation/${invitationToken}`;
        
        // Send invitation email
        const emailResult = await sendTeamInvitation(
            email, 
            `${firstName} ${lastName}`, 
            company.companyName, 
            invitationLink
        );
        
        if (!emailResult.success) {
            // If email fails, delete the team member and return error
            await TeamMember.findByIdAndDelete(teamMember._id);
            return res.status(500).json({ 
                message: "Failed to send invitation email. Please try again." 
            });
        }
        
        res.status(201).json({
            message: "Team member invited successfully",
            teamMember: {
                id: teamMember._id,
                firstName: teamMember.firstName,
                lastName: teamMember.lastName,
                email: teamMember.email,
                status: teamMember.status,
                role: teamMember.role
            }
        });
        
    } catch (error) {
        console.error("Team invitation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Create team member directly with admin-provided password (no email invite)
app.post("/create-team-member", async (req, res) => {
    try {
        const { firstName, lastName, email, companyId, password } = req.body;

        if (!firstName || !lastName || !email || !companyId || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const existingMember = await TeamMember.findOne({ email, companyId });
        if (existingMember) {
            return res.status(400).json({ message: "Team member with this email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const teamMember = new TeamMember({
            firstName,
            lastName,
            email,
            companyId,
            password: hashedPassword,
            status: 'Active',
        });

        await teamMember.save();

        return res.status(201).json({
            message: "Team member created successfully",
            teamMember: {
                id: teamMember._id,
                firstName: teamMember.firstName,
                lastName: teamMember.lastName,
                email: teamMember.email,
                status: teamMember.status,
            }
        });
    } catch (error) {
        console.error("Create team member error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Accept team invitation
app.post("/accept-invitation", async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        
        // Validation
        if (!token || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        
        // Verify invitation token
        const decodedToken = verifyInvitationToken(token);
        if (!decodedToken) {
            return res.status(400).json({ message: "Invalid or expired invitation token" });
        }
        
        // Find team member by token
        const teamMember = await TeamMember.findOne({ 
            invitationToken: token,
            status: 'Pending'
        }).populate('companyId');
        
        if (!teamMember) {
            return res.status(400).json({ message: "Invalid invitation or already accepted" });
        }
        
        // Check if invitation is expired
        if (new Date() > teamMember.invitationExpires) {
            return res.status(400).json({ message: "Invitation has expired" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Update team member
        teamMember.password = hashedPassword;
        teamMember.status = 'Active';
        teamMember.acceptedAt = new Date();
        teamMember.invitationToken = undefined;
        teamMember.invitationExpires = undefined;
        
        await teamMember.save();
        
        // Send welcome email
        const loginLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/team-login`;
        await sendWelcomeEmail(
            teamMember.email,
            `${teamMember.firstName} ${teamMember.lastName}`,
            teamMember.companyId.companyName,
            loginLink
        );
        
        res.status(200).json({
            message: "Invitation accepted successfully",
            teamMember: {
                id: teamMember._id,
                firstName: teamMember.firstName,
                lastName: teamMember.lastName,
                email: teamMember.email,
                status: teamMember.status
            }
        });
        
    } catch (error) {
        console.error("Accept invitation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get team members for a company
app.get("/team-members/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        
        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        // Get team members
        const teamMembers = await TeamMember.find({ companyId })
            .select('-password -invitationToken -invitationExpires')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Team members retrieved successfully",
            teamMembers
        });
        
    } catch (error) {
        console.error("Get team members error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Validate invitation token
app.get("/validate-invitation/:token", async (req, res) => {
    try {
        const { token } = req.params;
        
        // Verify invitation token
        const decodedToken = verifyInvitationToken(token);
        if (!decodedToken) {
            return res.status(400).json({ message: "Invalid or expired invitation token" });
        }
        
        // Find team member by token
        const teamMember = await TeamMember.findOne({ 
            invitationToken: token,
            status: 'Pending'
        }).populate('companyId');
        
        if (!teamMember) {
            return res.status(400).json({ message: "Invalid invitation or already accepted" });
        }
        
        // Check if invitation is expired
        if (new Date() > teamMember.invitationExpires) {
            return res.status(400).json({ message: "Invitation has expired" });
        }
        
        res.status(200).json({
            message: "Invitation token is valid",
            invitation: {
                firstName: teamMember.firstName,
                lastName: teamMember.lastName,
                email: teamMember.email,
                companyName: teamMember.companyId.companyName,
                role: teamMember.role
            }
        });
        
    } catch (error) {
        console.error("Validate invitation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Team member login
app.post("/team-login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Find team member
        const teamMember = await TeamMember.findOne({ email }).populate('companyId');
        if (!teamMember) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Check if account is active
        if (teamMember.status !== 'Active') {
            return res.status(401).json({ message: "Account is not active. Please accept your invitation first." });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, teamMember.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        // Update last login
        teamMember.lastLogin = new Date();
        await teamMember.save();
        
        // Generate token
        const token = jwt.sign(
            { 
                id: teamMember._id, 
                email: teamMember.email, 
                companyId: teamMember.companyId._id,
                role: 'team_member'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(200).json({
            message: "Login successful",
            token: token,
            teamMember: {
                id: teamMember._id,
                firstName: teamMember.firstName,
                lastName: teamMember.lastName,
                email: teamMember.email,
                role: teamMember.role,
                companyId: teamMember.companyId._id,
                companyName: teamMember.companyId.companyName
            }
        });
        
    } catch (error) {
        console.error("Team login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Test endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "Stock Management API is running",
        timestamp: new Date().toISOString(),
        models: {
            User: !!User,
            Company: !!Company,
            TeamMember: !!TeamMember,
            StockItem: !!StockItem,
            Category: !!Category
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


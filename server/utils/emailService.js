const nodemailer = require('nodemailer');

// Create transporter for Gmail (you can change this to any email service)
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASSWORD // Your Gmail app password
        }
    });
};

// Send team invitation email
const sendTeamInvitation = async (inviteeEmail, inviteeName, companyName, invitationLink) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: inviteeEmail,
            subject: `You've been invited to join ${companyName} on StockMaster`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">StockMaster</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">Team Invitation</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${inviteeName}!</h2>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            You've been invited to join <strong>${companyName}</strong> as a team member on StockMaster.
                        </p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            StockMaster is a comprehensive stock management system that will help you manage inventory, 
                            track sales, and collaborate with your team effectively.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${invitationLink}" 
                               style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; 
                                      text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; 
                                      display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                Accept Invitation
                            </a>
                        </div>
                        
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #374151; margin-top: 0;">What you'll be able to do:</h3>
                            <ul style="color: #6b7280; line-height: 1.6;">
                                <li>View and manage inventory</li>
                                <li>Track sales and performance</li>
                                <li>Collaborate with team members</li>
                                <li>Generate reports and analytics</li>
                            </ul>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            This invitation will expire in 7 days. If you have any questions, please contact your team administrator.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                        <p>© 2024 StockMaster. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Team invitation email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
        
    } catch (error) {
        console.error('Error sending team invitation email:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email after invitation acceptance
const sendWelcomeEmail = async (memberEmail, memberName, companyName, loginLink) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: memberEmail,
            subject: `Welcome to ${companyName} on StockMaster!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Welcome to StockMaster!</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">Your account is now active</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${memberName}!</h2>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Welcome to <strong>${companyName}</strong>! Your team invitation has been accepted and your account is now active.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginLink}" 
                               style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; 
                                      text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; 
                                      display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                                Access Your Dashboard
                            </a>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            If you have any questions or need assistance, please don't hesitate to contact your team administrator.
                        </p>
                    </div>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', result.messageId);
        return { success: true, messageId: result.messageId };
        
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendTeamInvitation,
    sendWelcomeEmail
};

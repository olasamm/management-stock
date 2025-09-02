# Email Functionality Setup for Team Invitations

This guide explains how to set up and use the email functionality for team invitations in the Stock Management System.

## 🚀 Features Implemented

### ✅ What's Working Now:
1. **Team Invitation System** - Company admins can invite team members
2. **Email Notifications** - Real emails sent to invitees
3. **Invitation Acceptance** - Team members can accept invitations and set passwords
4. **Team Login** - Accepted team members can log in
5. **Real-time Updates** - Dashboard updates immediately after actions

### 📧 Email Flow:
1. Admin invites team member → Email sent with invitation link
2. Team member clicks link → Goes to acceptance page
3. Team member sets password → Account activated
4. Welcome email sent → Team member can now log in

## 🔧 Setup Instructions

### 1. Install Dependencies

First, install the new dependencies in the server folder:

```bash
cd server
npm install nodemailer jsonwebtoken bcryptjs
```

### 2. Environment Configuration

Create a `.env` file in the server folder with these variables:

```env
# MongoDB Connection
URI=mongodb://localhost:27017/stock_management

# Server Configuration
PORT=1000

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Client URL (for invitation links)
CLIENT_URL=http://localhost:3000
```

### 3. Gmail App Password Setup

**Important:** You need to create an "App Password" for Gmail, not use your regular password.

#### Steps:
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "2-Step Verification"
3. Enable 2-Step Verification if not already enabled
4. Go to "App passwords"
5. Select "Mail" and "Other (Custom name)"
6. Name it "StockMaster" or similar
7. Copy the generated 16-character password
8. Use this password in your `.env` file

### 4. Alternative Email Services

If you don't want to use Gmail, you can modify `server/utils/emailService.js`:

#### SendGrid:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

#### Mailgun:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
});
```

## 🎯 How to Use

### 1. Invite Team Members

1. **Login as Company Admin**
   - Go to `/company-login`
   - Use your company admin credentials

2. **Navigate to Team Management**
   - Click "Team Management" in the sidebar
   - Click "Invite Member" button

3. **Fill Invitation Form**
   - Enter first name, last name, and email
   - Click "Send Invitation"

4. **Email Sent Automatically**
   - Invitee receives professional email
   - Contains invitation link valid for 7 days

### 2. Accept Invitation (Team Member)

1. **Click Email Link**
   - Team member clicks invitation link
   - Goes to `/accept-invitation/[token]`

2. **Set Password**
   - Create password (minimum 6 characters)
   - Confirm password
   - Click "Accept Invitation"

3. **Account Activated**
   - Welcome email sent automatically
   - Can now log in at `/team-login`

### 3. Team Member Login

1. **Go to Team Login**
   - Navigate to `/team-login`
   - Use email and password

2. **Access Dashboard**
   - View company information
   - Access team features

## 🔍 API Endpoints

### Team Management:
- `POST /invite-team-member` - Send invitation
- `GET /validate-invitation/:token` - Validate invitation token
- `POST /accept-invitation` - Accept invitation
- `GET /team-members/:companyId` - Get team members
- `POST /team-login` - Team member login

### Request Examples:

#### Invite Team Member:
```json
POST /invite-team-member
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "companyId": "company_id_here"
}
```

#### Accept Invitation:
```json
POST /accept-invitation
{
  "token": "invitation_token_here",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

## 🎨 Email Templates

### Invitation Email:
- Professional design with company branding
- Clear call-to-action button
- Information about StockMaster features
- 7-day expiration notice

### Welcome Email:
- Confirmation of account activation
- Login link
- Company information

## 🛠️ Troubleshooting

### Common Issues:

1. **"Failed to send invitation email"**
   - Check Gmail app password
   - Verify EMAIL_USER and EMAIL_PASSWORD in .env
   - Check if 2FA is enabled on Gmail

2. **"Invalid or expired invitation token"**
   - Token expires after 7 days
   - Check if invitation was already accepted
   - Verify JWT_SECRET in .env

3. **"Network error"**
   - Check if server is running on port 1000
   - Verify CORS settings
   - Check network connectivity

### Debug Mode:

Add this to your server to see email details:

```javascript
// In server/utils/emailService.js
console.log('Email options:', mailOptions);
console.log('Transporter config:', transporter.options);
```

## 🔒 Security Features

- **JWT Tokens** - Secure invitation tokens
- **Password Hashing** - bcrypt with salt rounds
- **Token Expiration** - 7-day validity
- **Input Validation** - Server-side validation
- **Email Verification** - Real email addresses required

## 📱 Frontend Integration

The frontend automatically:
- Fetches real team members from API
- Shows invitation status
- Updates dashboard in real-time
- Handles success/error messages

## 🚀 Next Steps

### Potential Enhancements:
1. **Email Templates** - Customizable email designs
2. **Bulk Invitations** - Invite multiple members at once
3. **Role Management** - Different permission levels
4. **Invitation Tracking** - See who accepted/declined
5. **Resend Invitations** - Send reminders

### Production Considerations:
1. **Email Service** - Use professional email service (SendGrid, Mailgun)
2. **Rate Limiting** - Prevent spam invitations
3. **Email Verification** - Verify email addresses before sending
4. **Logging** - Track all email activities
5. **Monitoring** - Monitor email delivery rates

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Test email configuration with a simple test
4. Check MongoDB connection and models

---

**Happy Coding! 🎉**

The email functionality is now fully integrated and ready to use!

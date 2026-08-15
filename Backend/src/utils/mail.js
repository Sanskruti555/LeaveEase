import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendOTPEmail = async (email, otp) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        text: `Your OTP is ${otp}`
    });

};

export const sendInvitationEmail = async (
    email,
    invitationToken,
    role
) => {

    const invitationLink =
    `${process.env.FRONTEND_URL}/accept-invitation/${invitationToken}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "You're invited to LeaveEase",
        text: `
You have been invited to join LeaveEase as ${role}.

Accept your invitation using the link below:

${invitationLink}

This invitation will expire in 24 hours.
        `
    });
};
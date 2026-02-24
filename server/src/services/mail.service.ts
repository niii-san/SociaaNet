import nodemailer from "nodemailer";
import { env } from "../config";
import { otpEmailTemplate } from "../utils";

class MailService {
    private from = `SociaaNet <${env.gmail_address}>`;
    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.gmail_address,
            pass: env.gmail_app_password
        }
    });

    async sendOTP(otp: string, to: string, fullName: string) {
        const mailOptions = {
            from: this.from,
            to,
            subject: "Your OTP for SociaaNet",
            html: otpEmailTemplate(otp, fullName)
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Failed to send OTP email:", error);
            return false;
        }

        return true;
    }

    async sendOnBoardingEmail(to: string, fullName: string) {
        throw new Error(
            "Onboarding email functionality is not implemented yet."
        );
    }
}

export const mailService = new MailService();

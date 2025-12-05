import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

// 1️⃣ SEND OTP
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ status: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

        res.json({
            status: true,
            message: "OTP sent to your email",
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// 2️⃣ VERIFY OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.resetPasswordOTP !== otp)
            return res.status(400).json({ status: false, message: "Invalid OTP" });

        if (user.resetPasswordExpires < Date.now())
            return res.status(400).json({ status: false, message: "OTP expired" });

        res.json({
            status: true,
            message: "OTP verified",
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// 3️⃣ RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.resetPasswordOTP !== otp)
            return res.status(400).json({ status: false, message: "Invalid request" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({
            status: true,
            message: "Password reset successfully",
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};


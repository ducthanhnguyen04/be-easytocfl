const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const model = require("../../models/index");
const User = model.User;
const AuthService = require("../../services/authService");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if(!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }
            const { user, token } = await AuthService.loginLocal(email, password);
            res.cookie(
                'token', token,
                {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'Strict',
                    maxAge: 1000 * 60 * 60
                }
             );
             res.json({
                message: "Login successful",
                user,
             })
        } catch (error) {
            console.error("Login error:", error);
            res.status(error.status || 500).json({ message: error.message || "Internal server error" });   
        }
    }

    async loginWithGoogle(req, res) {
        const {credential} = req.body;
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const { sub: googleId, email, name: userName, picture: avatarUrl } = ticket.getPayload();
            const [user, created] = await User.findOrCreate({
                where: { googleId },
                defaults: { email, userName, avatarUrl, role: 'user' },
            });
            if (!created) {
                await user.update({
                  userName: userName,
                  email,
                  avatarUrl: avatarUrl,
                  lastLogin: new Date(),
                });
            }
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie(
                'session_token',
                 token, 
                 { 
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'Lax', 
                    maxAge: 7 * 24 * 60 * 60 * 1000 
                });
            return res.status(200).json({message: 'Login with Google successful', user});
        } catch (error) {
            console.error('Error during Google login:', error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
    async logout(req, res) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });
        res.json({
            message: "Logout successfully!"
        })
    }
    async getCurrentUser(req, res) {
        return res.status(200).json({ success: true, user: req.user });
    }

    async register(req, res) {
        try {
            const { userName, email, password } = req.body;
            if(!userName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const newAcount = await AuthService.registerAccount(userName, email, password);
            return res.status(200).json({
                success: true,
                data: newAcount
            });
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).json({
                success: false,
                message: "BUG!"
            });
        }
    }
}

module.exports = new AuthController();
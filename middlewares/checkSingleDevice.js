const checkSingleDevice = async (req, res, next) => {
    try {
        console.log("--- Bắt đầu check Single Device ---");
        const token = req.cookies.token;
        if (!token) {
            console.log("Không tìm thấy Cookie!");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        console.log("Token Version:", decoded.version);
        console.log("DB Version:", user?.tokenVersion);

        if (!user || user.tokenVersion !== decoded.version) {
            console.log("=> Không khớp, Logout!");
            res.clearCookie('token');
            return res.status(401).json({ message: "Phiên đăng nhập hết hạn" });
        }

        console.log("=> Khớp! Cho qua.");
        req.user = user;
        next();
    } catch (error) {
        console.log("Lỗi Verify:", error.message);
        return res.status(401).json({ message: "Phiên đăng nhập hết hạn" });
    }
};

module.exports = checkSingleDevice;
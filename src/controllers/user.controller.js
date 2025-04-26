const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            const error = new Error("Các trường đều bắt buộc");
            error.statusCode = 400;
            throw error;
        }

        const userExists = await userModel.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            const error = new Error("Tên người dùng hoặc email đã tồn tại");
            error.statusCode = 400;
            throw error;
        }
        const user = await userModel.create({ username, email, password });

        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email và mật khẩu là bắt buộc");
            error.statusCode = 400;
            throw error;
        }

        const user = await userModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            const error = new Error("Email hoặc mật khẩu không hợp lệ");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
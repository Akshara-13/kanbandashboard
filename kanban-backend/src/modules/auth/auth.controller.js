const authService = require('./auth.service');
// USER REGISTRATION
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        const user = await authService.registerUser({
            name,
            email,
            password
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

    } catch (error) {
        if (error.message === 'Email already registered') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }
};

// USER LOGIN
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await authService.loginUser({
            email,
            password
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });

    } catch (error) {
        if (
            error.message === 'Invalid email or password' ||
            error.message === 'Account is inactive'
        ) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        next(error);
    }
};

module.exports = {
    register,
    login
};

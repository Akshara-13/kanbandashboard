const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//USER REGISTRATION

const registerUser = async ({ name, email, password }) => {

    // Check whether email already exists
    const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error('Email already registered');
    }

    //Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    //Insert user into database
    const result = await db.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name, email, passwordHash]
    );

    return result.rows[0];
};

const loginUser = async ({ email, password }) => {

    // Find user by email
    const result = await db.query(
        `SELECT id, name, email, password_hash, is_active
         FROM users
         WHERE email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    // Check account status
    if (!user.is_active) {
        throw new Error('Account is inactive');
    }

    // Compare entered password with stored hash
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
};


module.exports = {
    registerUser,
    loginUser
};

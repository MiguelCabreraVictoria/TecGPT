import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RoleType from '../common/enums/RoleType.enum.js';

function validateRegisterInput({email, password}){
    const minPasswordLength = 8;
    const tecEmailRegex = /^[a-zA-Z0-9._%+-]+@tec\.mx$/;
    
    if (!email || !password) {
        return "Email and password are required"
    }

    if (!tecEmailRegex.test(email)) {
        return "Invalid email format. Please use a @tec.mx email address."
    }

    if (password.length < minPasswordLength) {
        return "Password must be at least 8 characters long"
    }

    return null;
};

export const login = async (req, res) => {
    const { email, password} = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({
                state: "400",
                message: 'Email and password are required'
            });
        }

        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(401).json({
                state: "401",
                message: 'User Not Found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                state: "401",
                message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.userId }, "secret", { expiresIn: '1h' });
        return res.status(200).json({
            state: "200",
            message: 'Login successful',
            user: {
                userId: user.userId,
                campus: user.campus,
                name: user.name,
                lastName: user.lastName,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            state: "500",
            message: 'Internal server error' });
        
    }
};

export const register = async (req, res) => {
    console.log('🚀 Register endpoint hit!');
    console.log('📝 Request body:', req.body);
    
    const { campus, name, lastName, email, password } = req.body;
    
    try {
       const validationError = validateRegisterInput({email, password});
       if (validationError) {
        console.log('❌ Validation error:', validationError);
        return res.status(400).json({
            state: "400",
            message: validationError
        });
       }

       console.log('🔍 Checking if user exists...');
       const existingUser = await prisma.user.findUnique({where: { email }});
       if (existingUser){
        console.log('❌ User already exists');
        return res.status(409).json({
            state: "409",
            message: 'User already exists'
        });
       }

       console.log('🔍 Looking for USER role...');
       const userRole = await prisma.role.findUnique({
            where: { name: RoleType.USER }
       });
       
       console.log('👤 User role found:', userRole);
       
       if (!userRole) {
           console.log('❌ USER role not found in database');
           return res.status(500).json({
               state: "500",
               message: 'USER role not found. Please contact administrator.'
           });
       }

       console.log('🔐 Hashing password...');
       const hashedPassword = await bcrypt.hash(password, 10);
       
       console.log('👤 Creating new user...');
       const newUser = await prisma.user.create({
            data: {
                campus,
                name,
                lastName,
                email,
                password: hashedPassword,
                roleId: userRole.roleId
            }
        });

        console.log('✅ User created successfully:', newUser.userId);

        const token = jwt.sign({ userId: newUser.userId }, "secret", { expiresIn: '1h' });

        return res.status(201).json({
            state: "201",
            message: 'User created successfully',
            user: {
                userId: newUser.userId,
                campus: newUser.campus,
                name: newUser.name,
                lastName: newUser.lastName,
                email: newUser.email
            },
            token
        });

    } catch (error) {
        console.error('💥 Full error:', error);
        return res.status(500).json({
            state: "500",
            message: 'Internal server error' });
    }
};

export const logout = async (req, res) => {};
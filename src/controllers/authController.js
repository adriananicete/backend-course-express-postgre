import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // check if the user already exist
    const userExists = await prisma.user.findUnique({
        where: { email: email},
    });

    if(userExists) {
        return res.status(400).json({error: 'User already exists with this email'});
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
        },
    });

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email
            }
        }
    })

};


const login = async (req, res) => {
    const { email, password } = req.body;

    // check if the user email exist in the table
    const user = await prisma.user.findUnique({
        where: { email: email}
    });

    if(!user){
        res.status(401).json({error: 'Invalid email or password'});
    }

    // verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        res.status(401).json({error: 'Invalid email or password'});
    }

    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: email,
            }
        }
    })
};

export { register, login };
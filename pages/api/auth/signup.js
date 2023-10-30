// required imports to connect to prisma database
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// import helper function from lib folder to hash our password so we can safely store it in our database
import { hashPassword } from '../../../lib/auth'


// this function will fire when a request is sent to ---> '/api/auth/signup'
async function handler(req, res) {

    // this code should only run for POST method requests
    if (req.method !== 'POST') return

    // grab the data from the signup/login form
    const data = req.body

    // server side validations
    const {email, password} = data
    if(!email || !email.includes('@') || !password || password.trim().length < 7) {
        res.status(422).json({message: "Invalid Input... Please ensure your email includes '@' and password is at least 7 characters long"})
    }

    // attempt to create user instance, and then disconnect from prisma DB
    try {
        // search is user already exists with the given email
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if(existingUser) return res.status(409).json({ message: 'A user has already registered with that email' });

        // pass in a hashed password to the create method (remember to await it)
        const hashedPassword = await hashPassword(password)
                                                                            // hashed password goes here
        const createUser = await prisma.user.create( {data: {email: email, password: hashedPassword}} )
        console.log('INSTANCE CREATED TO USER TABLE ---> ', createUser);
        res.status(201).json({ message: 'User has been created successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Something Went Wrong Creating This User' });
        // whether success or fail, disconnect from our db client when this route concludes
    } finally {
        await prisma.$disconnect();
    }
}

export default handler

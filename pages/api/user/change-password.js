// your supposed to be able to use getSession() inside of this server side code, but I was having issues getting it to work,
// so instead, i just included the session data into the req.body

// used to cross check that the old password they gave us was the one found in the database
import { verifyPassword } from "../../../lib/auth"
import { hashPassword } from "../../../lib/auth"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function handler(req, res) {

    if(req.method !== "PATCH") {
        return
    }

    // make sure this request is coming from an authenticated user before doing anything
    // console.log("SSSSSS", req.headers.cookie)
    const session = req.body.session

    // if no active session, return
    // KEY TO PROTECTING OUR API ROUTES
    if(!session) {
        await prisma.$disconnect();
        return res.status(401).json({message: 'Not authenticated to make this request'})
    }

    // !!!***** this is possible because back in the [...nextauth].js route, we made it to where we stored the user email in the session object *****!!!
    const userEmail = session.user.email

    // grab the data from the request body
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword


    // search for user email in the DB
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if(!user) {
        await prisma.$disconnect();
        return res.status(404).json({message: 'User not found'})
    }

    // hashed password found in our database
    const currentPassword = user.password

    // if the plaintext password entered in the form matches the hashed password found in our database, we are good to update the password
    const arePasswordsEqual = await verifyPassword(oldPassword, currentPassword)

    if(!arePasswordsEqual) {
        await prisma.$disconnect();
        return res.status(403).json({message: 'Invalid Password'})
    }

    // hash the new password given by the user
    const hashedPassword = await hashPassword(newPassword)

    // update the user instance to include the new password field
    const updatedUser = await prisma.user.update({
        where: { email: userEmail }, // Use the same identifier as in the findUnique function
        data: {
          password: hashedPassword, // Replace 'password' with the actual field you want to update... REMEMBER TO HASH THE PASSWORD IN THE DATABASE
        },
    });

    await prisma.$disconnect();
    res.status(200).json({message: 'Password Updated Successfully'})

}

export default handler

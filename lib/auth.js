// we can put our auth utlility helper functions in this file

import { hash, compare } from "bcryptjs";

// this function returns a hashedPassword that we can store in the db, since storing plain-text passwords in the database is a terrible idea
export async function hashPassword(password) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword
}

// this function
export async function verifyPassword(password, hashedPassword) {
    const isValid = await compare(password, hashedPassword)
    return isValid
}

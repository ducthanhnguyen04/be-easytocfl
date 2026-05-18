import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export default {
    hashPassword,
    comparePassword
}
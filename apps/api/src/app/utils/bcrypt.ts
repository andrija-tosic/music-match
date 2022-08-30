import * as bcrypt from 'bcrypt'

const SALT = 9;

export function hashPassword(password: string) {
    return bcrypt.hash(password, SALT);
}

export async function compare(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
}
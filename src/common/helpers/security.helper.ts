import bcrypt from "bcryptjs";

export class SecurityHelper {
    async comparePassword(plain: string, hash: string) {
        return bcrypt.compare(plain, hash);
    }

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}

import bcrypt from "bcryptjs";
import * as crypto from "crypto";
export class SecurityHelper {
    async compareHashBcrypt(plain: string, hash: string) {
        return bcrypt.compare(plain, hash);
    }

    async hashBcrypt(password: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    hashTokenSHA256(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }
}

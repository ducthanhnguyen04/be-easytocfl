const bcrypt = require('bcrypt');
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
module.exports = {
    hashPassword,
    comparePassword
}
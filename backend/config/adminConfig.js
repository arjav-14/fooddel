const bcrypt = require('bcryptjs');

const adminConfig = {
    email: "admin@admin.com",
    // This is the hashed version of "admin123"
    passwordHash: "$2a$10$evIZY/1TqFezb3.1DmGxHezA3/QbdBoTIs025k9QahrFjz0AI9Fam"
};

module.exports = adminConfig;
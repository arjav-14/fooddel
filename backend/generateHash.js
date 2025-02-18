const bcrypt = require('bcryptjs');

const generateHash = async () => {
  const plainPassword = 'admin123'; // Replace with the actual password you want
  const saltRounds = 10;
  
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hashed Password:', hashedPassword);
};

generateHash();

const bcrypt = require('bcrypt');


async function verifyPassword(){
    const myPassword = '123456';
    const hash = '$2b$10$H4H5nGGlHb4UWKRm8EL6nOOngMMfYRmfACP/0cKrom7CUqJdmKoGm'
    const isMatch = await bcrypt.compare(myPassword, hash);
    console.log(isMatch);
}

verifyPassword();
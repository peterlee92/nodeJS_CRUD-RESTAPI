const db = require('../dbconnect');
const bcrypt = require('bcrypt');
const dot = require('dotenv');
dot.config();
const bcrypt_round = Number(process.env.BCRYPT_ROUND);

const Create = async(data) =>{

    try{   
        //Query for checking if email already exists
        let checkEmail = await await db.query(`
            SELECT * FROM users WHERE email = $1
        `, [data.email]);

        //When email already exists
        if(checkEmail.length > 0 ){
            return 'Email already exists';
        } 
        
        //When email does not exist
        else {
            
            try{
                const hashedPassword = await bcrypt.hash(data.password, bcrypt_round);
                // Query for creating a user
                let createUser = await db.query(`
                    INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3)
                `,[data.fullname, data.email, hashedPassword]);
                return 'Successfully created';

            }catch(err){
                return 'Database error';
            }
        }

    }catch(err){
        return 'Database error';
    }
}

const Read = async(data) => {
    try{
        //Query for checking if email exists
        let checkEmail = await db.query(`
            SELECT * FROM users WHERE email = $1
        `,[data.email]);
        //When email exists
        if(checkEmail.length > 0){
            //Check if password is correct
            let pwdCheck = await bcrypt.compare(data.password, checkEmail[0].password);
            //When password is correct
            if(pwdCheck){
                return 'Welcome! ' + checkEmail[0].fullname;
            }
            //When password is not correct
            else{
                console.log('work');
                return 'Wrong information';
            }
        } 
        //When email does not exist
        else {
            return 'Wrong information';
        }
    }catch(err){
        return 'Database error';
    }
}

const Update = async(data) => {
    try{
        const hashedPassword = await bcrypt.hash(data.password, bcrypt_round);
        let updateUser = await db.query(`
            UPDATE users SET fullname = $1, password = $2 WHERE email = $3
        `,[data.fullname, hashedPassword, data.email]);

        return 'User information updated';
    }catch(err){
        return 'Database error';
    }
}

const Delete = async(data) => {
    try{
        const deleteUser = await db.query(`
            DELETE FROM users WHERE email = $1
        `,[data.email]);
        return 'User deleted';
    }catch(err){
        return 'Database error';
    }
}

module.exports = {
    Create:Create,
    Read:Read,
    Update:Update,
    Delete:Delete
}
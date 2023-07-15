import pg from 'pg';
import crypto from 'crypto'

const config = {
    host: 'localhost',
    port: 5432,
    user: 'Kapil',
    password : 'Kapil@123',
    database : 'signalDB'
}

const pool = new pg.Pool(config);

async function addUser(user){
    if(user.username==undefined || user.email_id == undefined || user.phone == undefined || user.dob == undefined || user.password == undefined || user.gender == undefined){
        return false;
    }
    const verification_token = crypto.randomBytes(10).toString('hex');
    const registration_date = new Date().toISOString()
    const client = await pool.connect();
    try{
        const text = `INSERT INTO public.users(user_name, email_id, phone_number, account_password, date_of_birth, gender, registration_date, verification_token, is_verified, password_update_token, is_active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
        const values = [user.username, user.email_id, user.phone, user.password, user.dob, user.gender, registration_date, verification_token, false, null, true];
        await client.query(text, values);
        return true;
    } catch(err){
        console.log(err.message);
        return false;
    } finally {
        client.release();
    }
}
async function verifyUser(token){

}

async function checkUser(user){
    console.log(user);
    const client = await pool.connect();
    try {
        const text = `SELECT * FROM public.users WHERE email_id = $1 AND account_password = $2`;
        const values = [user.email_id, user.password];
        const result = await client.query(text,values);
        if(result.rows.length === 1){
            return { flag: 1, user: result.rows[0]};
        }else{
            return { flag: 0, user: undefined };
        }
    } catch(error) {
        console.log(error.message);
    } finally {
        client.release();
    }
}

async function updatePassword(user){

}

export default  {addUser,verifyUser, checkUser, updatePassword};

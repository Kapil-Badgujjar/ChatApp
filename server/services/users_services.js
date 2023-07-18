import pg from 'pg';
const config = {
    host: 'localhost',
    port: 5432,
    user: 'Kapil',
    password : 'Kapil@123',
    database : 'signalDB'
}

const pool = new pg.Pool(config);

async function addUser(user,verification_token){
    if(user.name==undefined || user.email_id == undefined || user.phone == undefined || user.dob == undefined || user.password == undefined){
        return false;
    }
    if(user.gender===undefined){
        user.gender = 'Unknown';
    }
    console.log(user);
    const registration_date = new Date().toISOString()
    const client = await pool.connect();
    try{
        const text = `INSERT INTO public.users(user_name, email_id, phone_number, account_password, date_of_birth, gender, registration_date, verification_token, is_verified, password_update_token, is_active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
        const values = [user.name, user.email_id, user.phone, user.password, user.dob, user.gender, registration_date, verification_token, false, null, true];
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
    console.log(token);
    const client = await pool.connect();
    try {
        const text = `UPDATE public.users SET is_verified = $1 WHERE verification_token = $2`;
        const values = [true, token];
        await client.query(text,values);
        console.log('User verified successfully');
    } catch(error) {
        console.log(error.message);
    } finally {
        client.release();
    }
}

async function checkUser(user){
    console.log(user);
    const client = await pool.connect();
    try {
        // const text =SELECT * FROM public.users WHERE email_id = 'kapilbadgujjar99@gmail.com' AND account_password = 'Kapil@123' AND is_verified = true`
        const text = `SELECT * FROM public.users WHERE email_id = $1 AND account_password = $2 AND is_verified = $3`;
        const values = [user.email_id, user.password, true];
        const result = await client.query(text,values);
        console.log(result);
        if(result.rows.length === 1){
            return { flag: 1, user: result.rows[0]};
        }else{
            return { flag: 0, user: undefined };
        }
    } catch(error) {
        console.log(error.message);
        return { flag: 0, user: undefined };
    } finally {
        client.release();
    }
}
async function findUser(user){
    console.log(user);
    const client = await pool.connect();
    try {
        const text = `SELECT * FROM public.users WHERE email_id = $1`;
        const values = [user.email_id];
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
async function setPasswordUpdateRequest(user,token){
    const client = await pool.connect();
    try {
        const text = `UPDATE public.users SET password_update_token = $2 WHERE email_id = $1`;
        const values = [user.email_id, token];
        await client.query(text,values);
    } catch(error) {
        console.log(error.message);
    } finally {
        client.release();
    }
}
async function updatePassword(password,token){
    const client = await pool.connect();
    try {
        const text = `UPDATE public.users SET account_password = $1 WHERE password_update_token = $2`;
        const values = [password, token];
        await client.query(text,values);
    } catch(error) {
        console.log(error.message);
    } finally {
        client.release();
    }
}

export default  {addUser, verifyUser, checkUser, findUser, setPasswordUpdateRequest, updatePassword};

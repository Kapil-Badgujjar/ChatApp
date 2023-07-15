import pg from 'pg'

const config = {
    host : 'localhost',
    port : 5432,
    user : 'Kapil',
    password : 'Kapil@123',
    database : 'signalDB'
}

const pool = new pg.Pool(config);

async function getFriends(user_id){
    const client = await pool.connect();
    try {
        const text =`select chat_id, users.* from friends inner join users on participent_1=user_id where participent_2= $1 union select chat_id, users.* from friends inner join users on participent_2 = user_id where participent_1 = $1`;
        const values = [user_id];
        const result = await client.query(text,values);
        return result.rows;
    } catch ( error ) {
        console.log( error );
    } finally {
        client.release();
    }
}

async function searchFriends(user_id, search_text) {
    const client = await pool.connect();
    try {
        const query = `SELECT user_id , user_name, email_id FROM public.users WHERE user_name LIKE $2 AND user_id <> $1 AND user_id NOT IN (SELECT participent_2 FROM public.friends WHERE participent_1=$1 UNION SELECT participent_1 FROM public.friends WHERE participent_2=$1)`;
        const values = [user_id, search_text + '%'];
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
}

async function addFriend(user_id, id){
    const client = await pool.connect();
    const createdTime = new Date().toISOString()
    try {
        const query = `INSERT INTO public.friends(participent_1, participent_2, created_time) VALUES ($1,$2,$3)`;
        const values = [user_id, id, createdTime];
        await client.query(query, values);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    } finally {
        client.release();
    }
}

async function removeFriend(user_id, id){
    const client = await pool.connect();
    try {
        const query = `DELETE TABLE public.friends WHERE participent_1 = $1 AND participent_2 = $2 OR participant_1 = $2 AND participant_2 = $1)`;
        const values = [user_id, id];
        const result = await client.query(query, values);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    } finally {
        client.release();
    }
}

export default {getFriends,searchFriends,addFriend,removeFriend}
import pg from 'pg'
import crypto from 'crypto'
const config = {
    host : 'localhost',
    port : 5432,
    user : 'Kapil',
    password : 'Kapil@123',
    database : 'signalDB'
}

const pool = new pg.Pool(config);

async function getGroups(user_id){
    const client = await pool.connect();
    try {
        const text = 
        `SELECT F.chat_id, F.group_name FROM friends F
        INNER JOIN ( 
                    SELECT chat_id 
                    FROM public.participents
                    WHERE participent_id = $1
                    ) AS P
        ON P.chat_id = F.chat_id
        WHERE F.group_name IS NOT NULL`;
        const values = [user_id];
        const result = await client.query(text,values);
        return result.rows;
    } catch ( error ) {
        console.log( error );
    } finally {
        client.release();
    }
}

async function addGroup(user_id, group_name){
    const client = await pool.connect();
    const createdTime = new Date().toISOString()
    try {
        let chat_id = undefined;
        const token = crypto.randomBytes(10).toString('hex');
        const text = `INSERT INTO public.friends(created_time,group_name,token) VALUES($1,$2,$3)`;
        const values = [createdTime,group_name,token];
        await client.query(text,values);
        const text2 = `SELECT chat_id, group_name from public.friends WHERE token = $1`;
        const values2 = [token];
        const result = await client.query(text2,values2);
        chat_id= result.rows[0].chat_id;
        const text3 = `INSERT INTO public.participents(chat_id, participent_id) values ($1, $2)`;
        const values3 = [chat_id, user_id];
        await client.query(text3, values3);
        return result.rows;
    } catch ( error ) {
        console.log( error );
        return undefined;
    } finally {
        client.release();
    }
}

async function removeGroup(){

}

async function searchFriends(chat_id, search_text) {
    const client = await pool.connect();
    try {
        const query = `SELECT user_id , user_name, email_id FROM public.users WHERE user_name LIKE $2 AND user_id NOT IN (SELECT participent_id FROM public.participents WHERE chat_id = $1 )`;
        const values = [chat_id, search_text + '%'];
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
}

async function addFriendsToGroup(chat_id, participent_id){
    const client = await pool.connect();
    try{
        const text = `INSERT INTO public.participents(chat_id, participent_id) values ($1, $2)`;
        const values = [chat_id, participent_id];
        await client.query(text, values);
    }
    catch(error) {
        console.log(error.message);
    }
}
export default {getGroups, addGroup, searchFriends, addFriendsToGroup}
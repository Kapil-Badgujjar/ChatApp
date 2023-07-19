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

async function getFriends(user_id){
    const client = await pool.connect();
    try {
        const text = `SELECT Y.chat_id, Y.participent_id, X.user_name, X.email_id
        FROM public.users AS X
        INNER JOIN (
            SELECT P.chat_id, P.participent_id, F.group_name FROM public.friends AS F
            INNER JOIN 
                (
                    SELECT chat_id, participent_id 
                    FROM public.participents
                    WHERE chat_id IN (
                        SELECT chat_id 
                        FROM public.participents
                        WHERE participent_id = $1
                    )
                    AND participent_id <> $1
                ) AS P
            ON P.chat_id = F.chat_id
            ) AS Y
        ON X.user_id = Y.participent_id
        WHERE Y.group_name IS null`;
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
        // const query = `SELECT user_id , user_name, email_id FROM public.users WHERE user_name LIKE $2 AND user_id <> $1 AND user_id NOT IN (SELECT participent_2 FROM public.friends WHERE participent_1=$1 UNION SELECT participent_1 FROM public.friends WHERE participent_2=$1)`;
        const query = `SELECT user_id, user_name, email_id FROM public.users WHERE user_name LIKE $2 AND user_id NOT IN
                        (SELECT DISTINCT participent_id FROM public.participents WHERE chat_id IN
                            (SELECT chat_id FROM public.participents WHERE participent_id = $1))`
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
        let chat_id = undefined;
        const token = crypto.randomBytes(10).toString('hex');
        const query1 = `INSERT INTO public.friends(created_time, token) VALUES ($1,$2)`;
        const query2 = `SELECT chat_id FROM public.friends WHERE token = $1`;
        const query3 = `INSERT INTO public.participents(chat_id, participent_id) VALUES ($1,$2)`;
        const values1 = [createdTime, token];
        const values2 = [token];
        await client.query(query1, values1);
        const result = await client.query(query2, values2);
        chat_id = result.rows[0].chat_id;
        const values3 = [chat_id, user_id];
        const values4 = [chat_id, id];
        await client.query(query3, values3);
        await client.query(query3, values4);
        console.log(chat_id);
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

export default { getFriends, searchFriends, addFriend, removeFriend }
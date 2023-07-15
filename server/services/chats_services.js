import pg from 'pg'

const config = {
    host: 'localhost',
    port : 5432,
    user: 'Kapil',
    password: 'Kapil@123',
    database: 'signalDB'
}

const pool = new pg.Pool(config);

async function getChats( chat_id){
    const client = await pool.connect();
    try {
        const text = `SELECT * FROM public.chats WHERE chat_id = $1`;
        const values = [chat_id ];
        const result = await client.query(text,values);
        return result.rows;
    } catch(error) {
        console.log(error);
    } finally {
        client.release();
    }
}

async function saveMessage(chat_id,message,sender_id) {
    const client = await pool.connect();
    const sent_time = new Date().toISOString()
    try {
        const text = `INSERT INTO public.chats(chat_id,message_type,message_text,object_source,sender_id,sent_time,is_seen,is_deleted_for_everyone,is_deleted) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
        const values = [chat_id,'text',message,null,sender_id,sent_time,false,false,false];
        await client.query(text,values);
        return true;
    }
    catch (error) {
        console.log(error.message);
        return false;
    } finally {
        client.release();
    }
}
export default {getChats,saveMessage};
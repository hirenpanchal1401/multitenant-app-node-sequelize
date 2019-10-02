// import { getConnection } from '../connectionManager';
import * as _ from './../models';

export const list = async (req, res) => {
    try {
        console.log('slug',req.query.slug)
        console.log('connection',connection )
        const user = await connection[req.query.slug].users.findAll();
        console.log('user',user)
        res.json({ body: user[0] });
    } catch (error) {
        res.json({ error: error });
    }
}
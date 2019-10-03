import { getCommonConnection } from '../../models';

export const list = async (req, res) => {
    try {
        const tenants = await getCommonConnection().tenants.findAll();
        res.json({ data: tenants });
    } catch (error) {
        res.json({ error: error.message })
    };
}
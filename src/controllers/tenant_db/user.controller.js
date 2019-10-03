import { getConnection } from "../../models";

export const list = async (req, res) => {
  try {
    const user = await getConnection(req).users.findAll();
    res.json({ data: user });
  } catch (error) {
    res.json({ error: error.message });
  }
};

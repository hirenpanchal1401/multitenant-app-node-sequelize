import { getConnection } from "./../models";

export const list = async (req, res) => {
  try {
    console.log(req.query.slug)
    const user = await getConnection(req.query.slug).users.findAll();
    console.log("user", user);
    res.json({ body: user[0] });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
};

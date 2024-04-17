import { isEmpty } from "lodash";

const handler = async (req, res) => {
  if (isEmpty(req.body)) {
    return res.status(400).json({ error: "Required data not sent" });
  }
  const data = req.body;
  data.message = "Data get success";

  return res.status(200).json(data);
};

export default handler;

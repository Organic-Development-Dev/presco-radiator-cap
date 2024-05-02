import axios from "axios";
import { isEmpty } from "lodash";

const handler = async (req, res) => {
  if (isEmpty(req.body)) {
    return res.status(400).json({ error: "Required data not sent" });
  }

  const data = req.body;

  try {
    const response = await axios.post(
      "https://presco-radiator-caps.com/wp-json/contact-form-7/v1/contact-forms/4791/feedback",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res
      .status(200)
      .json({ ...data, status: "success", message: response.data.message });
  } catch (error) {
    return res
      .status(500)
      .json({
        ...data,
        status: "error",
        message: response.data.message,
        error: error,
      });
  }
  // return res.status(200).json(data, { message: "Success" });
};

export default handler;

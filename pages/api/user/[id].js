import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

dbConnect();

export default async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  // console.log(method);

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(id);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
      }

      break;
    case "PUT":
      try {
        const {
          name,
          image,
          email,
          realName,
          surname,
          youtubeChannelUrl,
          bio,
          hobby,
          hasCompletedLogin,
        } = req.body;

        const user = await User.findByIdAndUpdate(id, {
          name,
          image,
          email,
          realName,
          surname,
          bio,
          hasCompletedLogin,
        });
        console.log(user);
        console.log(req.body);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
      }

      break;
    default:
      res.status(400).json({ message: "Method not allowed" });
      break;
  }
};

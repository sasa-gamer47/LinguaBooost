import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

dbConnect();

export default async (req, res) => {
    const {
        method,
        query: { email },
    } = req;

    // console.log(method);

    switch (method) {
        case "GET":
        try {
            const user = await User.find({ email: email });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }

        break;
        case "PUT":
        try {
            const user = await User.findOneAndUpdate({ email: email });
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

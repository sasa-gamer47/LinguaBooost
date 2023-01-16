import dbConnect from "../../../utils/dbConnect";
import Quiz from "../../../models/Quiz";

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
            const quiz = await Quiz.findById(id);
            res.status(200).json({ success: true, data: quiz });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }

        break;
        case "PUT":
        try {
            const {
                results,
                usersWhoPlayed
            } = req.body;

            const quiz = await Quiz.findByIdAndUpdate(id, {
                results,
                usersWhoPlayed,
            });
            console.log(quiz);
            console.log(req.body);
            res.status(200).json({ success: true, data: quiz });
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

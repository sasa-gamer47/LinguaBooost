import dbConnect from "../../../utils/dbConnect";
import Quiz from "../../../models/Quiz";

dbConnect();

export default async (req, res) => {
    const { method } = req;

    // console.log(method);

    switch (method) {
        case "GET":
        try {
            const quizzes = await Quiz.find({});
            res.status(200).json({ success: true, data: quizzes });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }

        break;
        case "POST":
        try {
            const quiz = await Quiz.create(req.body);
            res.status(201).json({ success: true, data: quiz });
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

import { Router } from "express";
import { createNewQuestion, getAllQuestions ,changeStatus, newReminder, markAsStarred} from "../controllers/question.controller.js";

export const questionRouter=Router();
questionRouter.route("/newQuestion").post(createNewQuestion)
questionRouter.route("/getAllQuestions").get(getAllQuestions)
questionRouter.route('/:questionId/question/:userId').put(changeStatus)
questionRouter.route('/reminder/:questionId/question/:userId').post(newReminder)
questionRouter.route('/markAsStar/:questionId/question/:userId').put(markAsStarred);
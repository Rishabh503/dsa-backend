import { Router } from "express";
import { createNewQuestion, getAllQuestions ,changeStatus} from "../controllers/question.controller.js";

export const questionRouter=Router();
questionRouter.route("/newQuestion").post(createNewQuestion)
questionRouter.route("/getAllQuestions").get(getAllQuestions)
questionRouter.route('/:questionId/question/:userId').put(changeStatus)
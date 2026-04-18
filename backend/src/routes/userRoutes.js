import  express  from "express";
import {validateLogin, validateSingUp } from "../../middleware.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { loginUser, UserRegister } from "../controllers/user.js";

const router = express.Router();

// router.get("/home" , (req,res) => {
// // res.send("home");
// })
router.post("/register" , validateSingUp , UserRegister);

router.post("/login" , validateLogin, loginUser);


export const userRoutes = router;
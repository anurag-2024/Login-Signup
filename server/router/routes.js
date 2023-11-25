import { Router } from "express";
import * as controller from "../controllers/appcontroller.js";
import Auth,{localVariables} from "../middleware/auth.js";
import sendMail from "../controllers/mailer.js";
const router = Router();
/**Post methods */
router.post("/register", controller.register)
router.post("/registerMail",sendMail);
router.post("/authenticate",controller.verifyUser,(req,res)=>{res.end()})
router.post("/login",controller.verifyUser, controller.login)

/**Get methods */
router.get("/user/:username",controller.getUser)
router.get("/generateOTP",controller.verifyUser,localVariables,controller.generateOTP)
router.get("/verifyOTP",controller.verifyUser,controller.verifyOTP)
router.get("/createResetSession",controller.createResetSession)

/**Put methods */
router.put("/updateuser",Auth,controller.updateUser)
router.put("/resetPassword",controller.verifyUser,controller.resetPassword)

export default router;
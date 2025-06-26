import { Router } from "express";
import { changeCurrentPassword, 
            getCurrentUser, getUserchannelProfile, getWatchHistory, loginuser, logoutUser, refreshAccessToken, registerUser, upadteUserAvatar, upadteUserCoverImage, UpdateaccountDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1,

        }
    ]),
    registerUser
)

router.route("/login").post(loginuser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
// router.get("/test", (req, res) => {
//   res.send("User route is working");
// });
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/upadte-account").patch(verifyJWT,UpdateaccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),upadteUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),upadteUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserchannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)


export default router 
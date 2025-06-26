import {asyncHandler} from "../utils/asyncHandler.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"

const healthcheck = asyncHandler(async (req, res) => {
    res.status(200).json(
        new Apiresponse(200, { status: "OK" }, "Server is healthy 🚀")
    );
});



export {
    healthcheck
    }
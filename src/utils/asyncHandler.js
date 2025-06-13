const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
            .catch((err)=>next(err));
    }
}
        
export {asyncHandler}


// const asyncHandler=(fn)=>(req,res,next)=>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(erros.code || 500).json({
//             success:false,
//             massage:error.massage
//         })
//     }
// }
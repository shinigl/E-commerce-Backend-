const roleMiddleware= (...role)=>(req,res,next)=>{
  if(role.includes(req.user.role))  {
    next()
  }else{
    res
    .status(403)
    .json({
        success:false,
        message:"You do not have permission to perform this action"
    })
  }
}

module.exports=roleMiddleware
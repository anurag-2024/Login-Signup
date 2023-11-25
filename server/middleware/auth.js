import jwt from "jsonwebtoken";
export default async function Auth(req,res,next){
    try{
      const token=req.headers.authorization.split(" ")[1];
      const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
      req.user=decodedToken;
      next();
    }
    catch(err){
        return res.status(500).send(err.message);
    }
}

export function localVariables(req,res,next){
    req.app.locals={
      OTP:null,
      resetSession:false
    }
    next();
}
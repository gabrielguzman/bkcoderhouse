import { Router } from "express";

const usersRouter = Router();

usersRouter.get('/', async(req,res)=>{
   res.send("estoy en usuarios");
});

export {usersRouter};
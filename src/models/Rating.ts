import { Request } from "express";

interface IRating{
    score: number,
    description: string
}

export default class Rating implements IRating{
    score: number;
    description: string;
    
    constructor(req: Request){
        this.score = req.body.score;
        this.description = req.body.description;
    }
}

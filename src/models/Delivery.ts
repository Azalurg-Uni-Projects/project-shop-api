import { Request } from "express";

interface IDelivery{
    name: string
    price: number
    free: number
}

export default class Delivery implements IDelivery{
    name: string
    price: number
    free: number
    
    constructor(req: Request){
        this.name = req.body.name;
        this.price = req.body.price;
        this.free = req.body.free;
    }
}

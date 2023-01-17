import { Request } from "express";

interface IDelivery{
    name: string
    price: number
}

export default class Delivery implements IDelivery{
    name: string
    price: number
    
    constructor(req: Request){
        this.name = req.body.name;
        this.price = req.body.price;
    }
}

import { Request } from "express";
import Rating from "./Rating";

interface IItem {
    name: string,
    imageUrl: URL,
    price: number,
    delivery: string[],
    description: string,
    quantity: number,
    categories: string[],
    rating: Rating[]
}

export class Item implements IItem{
    name: string;
    imageUrl: URL;
    price: number;
    delivery: string[];
    description: string;
    quantity: number;
    categories: string[];
    rating: Rating[];

    constructor(req: Request){
        this.name = req.body.name;
        this.imageUrl = req.body.imageUrl;
        this.price = req.body.price;
        this.description = req.body.delivery;
        this. delivery = req.body.description;
        this.quantity = req.body.quantity;
        this.categories = req.body.categories;
        this.rating = [];
    }
    
}

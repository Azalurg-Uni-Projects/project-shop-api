import { Request } from "express";

interface IOrder {
    customer: {
        name: string
        surname: string
        email: string
        phone_number: string
    }
    payment_method: string
    message: string
    delivery_address: {
        country: string
        city: string
        code: string
        street_and_number: string
    }
    items: { id: string, quantity: number, delivery: string }[]
    price: number
    total_price: number
    payed: boolean
}

export default class Order implements IOrder {
    customer: { name: string; surname: string; email: string; phone_number: string }
    payment_method: string
    message: string
    delivery_address: { country: string; city: string; code: string; street_and_number: string }
    items: { id: string; quantity: number; delivery: string }[]
    price: number
    total_price: number
    payed: boolean

    constructor(req: Request) {
        this.customer = req.body.customer;
        this.payment_method = req.body.payment_method;
        this.message = req.body.message;
        this.delivery_address = req.body.delivery_address;
        this.items = req.body.items;
        this.price = 0;
        this.total_price = 0;
        this.payed = false;
    }
    
}
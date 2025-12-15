import { ProductI } from "./product";

export interface Order {
    shippingAddress: {
        details: string;
        phone: string;
        city: string;
    };
    taxPrice: number;
    shippingPrice: number;
    totalOrderPrice: number;
    paymentMethodType: "cash" | "card";
    isPaid: boolean;
    isDelivered: boolean;
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    cartItems: OrderCartItem[];
    createdAt: string;
    updatedAt: string;
    id: number;
}

export interface OrderCartItem {
    count: number;
    product: ProductI;
    price: number;
    _id: string;
}

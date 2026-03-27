export interface Product {
  _id?: string;
  image: string;
  // Legacy fields (for backward compatibility)
  name: string;
  descripcion: string;
  // Multilingual fields
  name_es?: string;
  name_en?: string;
  descripcion_es?: string;
  descripcion_en?: string;
  precio: number;
  categoria: string;
  stock?: number;
  tiendaId?: string;
  createdAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  cartKey?: string; // unique key: _id + size
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  role: string;
  tiendaId?: string | null;
}

export interface IOrderItem {
  product: string | Product;
  quantity: number;
  price: number;
  size?: string;
}

export interface IOrder {
  _id?: string;
  user: string | IUser;
  items: IOrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICupon {
  _id?: string;
  codigo: string;
  descuento: number; // percentage 1-100
  fechaExpiracion: string;
  activo: boolean;
  createdAt?: string;
}

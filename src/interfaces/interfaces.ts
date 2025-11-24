export interface Product {
  _id?: string;
  image: string;
  name: string;
  descripcion: string;
  precio: number;
  categoria: string;
   tiendaId?: string;
  createdAt?: string;
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
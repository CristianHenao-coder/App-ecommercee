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
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
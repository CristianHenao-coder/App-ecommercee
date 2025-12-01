
import axios from "axios";
import { ContactForm } from "@/interfaces/interfaces";


export const sendContact = async (form: ContactForm) => {
  const res = await axios.post("/api/contact", form);
  return res.data;
};

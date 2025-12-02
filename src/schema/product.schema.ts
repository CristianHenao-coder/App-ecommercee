
import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  descripcion: yup.string().required("La descripción es obligatoria"),
  precio: yup
    .number()
    .typeError("El precio debe ser un número")
    .required("El precio es obligatorio")
    .min(0, "El precio no puede ser negativo"),
  categoria: yup.string().required("La categoría es obligatoria"),
  stock: yup
    .number()
    .typeError("El stock debe ser un número")
    .min(0)
    .optional(),
  createdBy: yup.string().optional(),
});

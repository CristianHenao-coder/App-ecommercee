import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre es muy corto"),
  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("El correo no es válido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener mínimo 6 caracteres"),
  phone: yup
    .string()
    .optional()
    .test(
      "is-valid-phone",
      "Por favor ingresa un número de celular válido", // 👈 ESTE ES EL TEXTO QUE QUIERES
      (value) => {
        if (!value) return true;    // opcional
        return /^\d+$/.test(value); // solo números
      }
    ),
  role: yup.string().optional(),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("El correo es obligatorio")
    .email("El correo no es válido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

# Post de productos para e-commerce

## Objetivo
Permitir crear y listar productos en la app de e-commerce, con validaciones en frontend y backend, subida de imágenes a Cloudinary y notificaciones de éxito/error.

## Alcance
- Crear producto (formulario + envío a API).
- Subida de imagen y obtención de `imageUrl`.
- Listado de todos los productos creados.

## Requisitos funcionales
1. **Formulario de creación (Frontend)**
   - Campos mínimos: `nombre`, `cantidad`, `precio`, `referencia`, `imageUrl` (este último se completa tras subir la imagen).
   - Cargar imagen desde un `<input type="file">`.
   - Validación en cliente con **React Hook Form** + **Yup**.
   - Al enviar:
     1) Subir imagen a **Cloudinary** y obtener `secure_url`.
     2) Enviar a la API el objeto `{ nombre, cantidad, precio, referencia, imageUrl }`.
   - Mostrar notificación al agregar producto (éxito o error).

2. **API / Backend**
   - Endpoint `POST /api/products` con validaciones del lado servidor (tipos, rangos, requeridos, unicidad de `referencia`).
   - Guardar en la base de datos (ej. `products`).
   - Endpoint `GET /api/products` para obtener todos los productos (paginable).

3. **Listado de productos (Frontend)**
   - Vista “Todos los productos” con tabla o tarjetas mostrando `nombre`, `precio`, `cantidad`, `referencia`, `imageUrl` (imagen).
   - Estado de carga y manejo de errores.

## Requisitos técnicos
- **Frontend:** React, React Hook Form, Yup, fetch/axios, notificaciones (toast).
- **Imagen:** Upload directo a **Cloudinary** (preset/unsigned o firmado desde el backend).
- **Backend:** Next Api con validaciones y manejo de errores.
- **DB:** MongoDB/PostgreSQL/MySQL (a definir) .

## Esquema de datos (ejemplo)
```json
{
  "id": "uuid",
  "nombre": "string",
  "cantidad": 0,
  "precio": 0.0,
  "referencia": "string-única",
  "imageUrl": "https://..."
}
```

## Endpoints (ejemplo)
- `POST /api/products`
  - Body: `{ nombre, cantidad, precio, referencia, imageUrl }`
  - Respuestas: `201 Created` con el producto; `400` por validación; `409` si `referencia` existe.
- `GET /api/products?limit=...&page=...`
  - Respuesta: `{ items: [...], total, page, limit }`

## Validaciones mínimas
- `nombre`: requerido, 2–100 chars.
- `cantidad`: requerido, entero ≥ 0.
- `precio`: requerido, número > 0.
- `referencia`: requerido, 3–50 chars, único.
- `imageUrl`: requerido, URL válida (https).

## Criterios de aceptación
- No se puede enviar el formulario si faltan campos o no pasan Yup.
- La imagen se sube a Cloudinary y su `secure_url` se guarda como `imageUrl`.
- Al crear con éxito: toast “Producto agregado”.
- El listado muestra el nuevo producto sin recargar la página (opcional: re-fetch).
- Errores de API se reflejan en mensajes claros al usuario.

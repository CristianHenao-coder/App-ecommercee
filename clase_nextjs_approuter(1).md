# Clase: Optimización de Rendimiento en Next.js (App Router)

Esta clase reúne los principales conceptos de optimización en Next.js utilizando **App Router**, con ejemplos demostrativos y prácticas sugeridas. El enfoque se centra en cómo funcionan estas técnicas actualmente en las versiones modernas de Next.js.

---

## Optimización de Imágenes con `<Image />`

El componente `Image` de Next.js ofrece optimización automática: selección de formato eficiente (WebP/AVIF), carga diferida y adaptación a diferentes tamaños de pantalla.

En App Router, su uso es idéntico, pero puede emplearse tanto en componentes de servidor como de cliente según sea necesario.

### Información adicional
- `priority` debe usarse únicamente para imágenes críticas (hero banners).
- `loading="lazy"` viene activado por defecto en imágenes que no usan `priority`.
- En App Router, no se requiere configuración especial para optimización de imágenes.

### Ejemplo demostrativo
```jsx
// app/components/ResponsiveImage.jsx
import Image from "next/image";

export default function ResponsiveImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      style={{ width: "100%", height: "auto" }}
      priority
    />
  );
}
```

---

## Prefetching Automático en App Router

Next.js realiza prefetching de recursos cuando se utiliza el componente `Link` y el enlace se encuentra visible en el viewport. Esto acelera la navegación al precargar recursos antes de que el usuario haga clic.

### Información adicional
- El prefetch viene activado por defecto.
- Puede deshabilitarse con `prefetch={false}` si la carga anticipada no es deseada.

### Ejemplo demostrativo
```jsx
// app/components/Nav.jsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/about">Acerca</Link>
      <Link href="/contact">Contacto</Link>
    </nav>
  );
}
```

---

## Análisis de Rendimiento

Next.js permite analizar el tamaño de los módulos del proyecto para identificar dependencias pesadas.

### Ejemplo demostrativo
```bash
next build --analyze
```

---

## Code Splitting y Lazy Loading (Dynamic Imports)

Next.js realiza división de código automáticamente por página y componente. Para casos específicos puede usarse `dynamic()`.

### ¿Se sigue usando fallback?
Sí, aún se usa. Con `dynamic()`, el parámetro `loading:` establece un componente temporal mientras se carga el módulo.

### Información adicional
- En App Router, los *Server Components* no permiten `dynamic()` con `ssr:false`.
- El componente dinámico debe ser cliente (`"use client"`).

### Ejemplo demostrativo
```jsx
// app/components/DynamicChart.jsx
"use client";

import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <p>Cargando...</p>,
});

export default function DynamicChartExample() {
  return (
    <section>
      <h2>Gráfico cargado bajo demanda</h2>
      <HeavyChart />
    </section>
  );
}
```

---

## Server-side Rendering (SSR) en App Router

El SSR en App Router se ejecuta automáticamente en componentes de servidor.

### Información adicional
- `fetch()` almacena resultados en caché a menos que se indique lo contrario.
- Para datos siempre actualizados: `{ cache: "no-store" }`.

### Ejemplo demostrativo
```jsx
// app/user/[id]/page.jsx
export default async function UserPage({ params }) {
  const user = await fetch(`https://api.example.com/user/${params.id}`, {
    cache: "no-store",
  }).then((res) => res.json());

  return <div>{user.name}</div>;
}
```

---

## Static Generation (SSG) en App Router

App Router permite generar contenido estático mediante `generateStaticParams()`.

### Ejemplo demostrativo
```jsx
// app/blog/[slug]/page.jsx
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "posts"));
  return files.map((f) => ({ slug: f.replace(".md", "") }));
}

export default function BlogPost({ params }) {
  const content = fs.readFileSync(`posts/${params.slug}.md`, "utf-8");
  return <article>{content}</article>;
}
```

---

## Pre-renderizado e ISR en App Router

El pre-renderizado ocurre automáticamente. La revalidación incremental permite actualizar páginas sin reconstruir todo el proyecto.

### Ejemplo demostrativo
```jsx
// app/news/page.jsx
export default async function NewsPage() {
  const news = await fetch("https://api.example.com/news", {
    next: { revalidate: 60 },
  }).then((res) => res.json());

  return (
    <ul>
      {news.map((n) => (
        <li key={n.id}>{n.title}</li>
      ))}
    </ul>
  );
}
```

---

## Conclusión

Esta clase presenta las técnicas principales de optimización en Next.js con App Router: imágenes optimizadas, prefetching, análisis de rendimiento, carga diferida, SSR, SSG e ISR. Su correcta implementación mejora la experiencia del usuario y el rendimiento general del proyecto.

"use client";

import { useEffect, useState } from "react";
import { Product } from "@/interfaces/interfaces";
import { productService } from "@/services/products";
import ProductModal from "@/components/modals/ProductModal";
import Link from "next/link";

const CATEGORIAS = [
  { id: "camisetas", nombre: "Camisetas Oversize", descripcion: "Tela peruana premium" },
  { id: "buzos", nombre: "Buzos Oversize", descripcion: "Cálidos con propósito" },
  { id: "camisas", nombre: "Camisas Cortas", descripcion: "Elegancia espiritual" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    productService.getAll().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    const phase1 = setTimeout(() => setAnimationPhase(1), 0);
    const phase2 = setTimeout(() => setAnimationPhase(2), 1500);
    const phase3 = setTimeout(() => setAnimationPhase(3), 2200);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getProductName = (product: Product) =>
    (product as any).name_es || (product as any).name_en || product.name || "";

  const getProductDescription = (product: Product) =>
    (product as any).descripcion_es || (product as any).descripcion_en || product.descripcion || "";

  const getRelatedProducts = (product: Product) => {
    return products.filter(
      (p) => p._id !== product._id && p.categoria === product.categoria
    ).slice(0, 4);
  };

  const productosPorCategoria = CATEGORIAS.map((cat) => ({
    ...cat,
    productos: products.filter(
      (p) => p.categoria?.toLowerCase() === cat.id || 
             p.categoria?.toLowerCase().includes(cat.id.slice(0, 4))
    ),
  }));

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden font-sans">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Fondo de nubes doradas */}
        <div 
          className={`absolute inset-0 z-0 transition-opacity duration-500 ${
            animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-radial from-white/20 via-amber-400/5 to-transparent animate-light-pulse" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
            <div className="cloud cloud-4"></div>
            <div className="cloud cloud-5"></div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
          
          {/* TÍTULO LOOK_GOD - ARRIBA DE TODO */}
          <h1 
            className={`text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-widest mb-4 transition-all duration-500 font-oswald relative z-10 ${
              animationPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{
              textShadow: '0 0 50px rgba(212, 175, 55, 0.8), 0 0 100px rgba(212, 175, 55, 0.5)',
              background: 'linear-gradient(180deg, #F5E6C8 0%, #D4AF37 40%, #B8860B 60%, #F5E6C8 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: animationPhase >= 1 ? 'gradient-shift 3s ease infinite' : 'none',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            }}
          >
            LOOK<span style={{ color: '#D4AF37' }}>_</span>GOD
          </h1>

          {/* Subtítulo */}
          <p 
            className={`text-lg sm:text-xl md:text-2xl tracking-[0.5em] uppercase mb-8 transition-all duration-500 font-oswald relative z-10 ${
              animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              color: '#F5E6C8',
              textShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            }}
          >
            El Verbo Hecho Estilo
          </p>

          {/* Layout: Texto - Imagen GRANDE - Texto */}
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center relative">
            
            {/* Texto Izquierdo - BLANCO con Didone */}
            <div 
              className={`flex-1 text-center md:text-right transition-all duration-500 z-10 pr-0 md:pr-4 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <p 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-1"
                style={{ 
                  fontFamily: 'var(--font-playfair), Playfair Display, serif',
                  fontStyle: 'italic',
                  color: '#ffffff',
                }}
              >
                Viste con
              </p>
              <p 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
                style={{ 
                  fontFamily: 'var(--font-playfair), Playfair Display, serif',
                  fontStyle: 'italic',
                  color: '#ffffff',
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                }}
              >
                Poder
              </p>
            </div>

            {/* Imagen Centro - MUY GRANDE con z-index alto */}
            <div 
              className={`flex-shrink-0 transition-all duration-700 z-20 ${
                animationPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <div className="relative">
                <div 
                  className={`absolute -inset-16 rounded-full transition-opacity duration-500 ${
                    animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, rgba(245, 230, 200, 0.3) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                  }}
                />
                <img
                  src="/portada/portada.png"
                  alt="LookGod"
                  className="relative z-10 max-h-[55vh] md:max-h-[70vh] lg:max-h-[80vh] w-auto object-contain"
                  style={{
                    filter: animationPhase >= 2 ? 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.6))' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Texto Derecho - BLANCO con Didone */}
            <div 
              className={`flex-1 text-center md:text-left transition-all duration-500 z-10 pl-0 md:pl-4 ${
                animationPhase >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <p 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-1"
                style={{ 
                  fontFamily: 'var(--font-playfair), Playfair Display, serif',
                  fontStyle: 'italic',
                  color: '#ffffff',
                }}
              >
                Viste con
              </p>
              <p 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
                style={{ 
                  fontFamily: 'var(--font-playfair), Playfair Display, serif',
                  fontStyle: 'italic',
                  color: '#ffffff',
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                }}
              >
                Propósito
              </p>
            </div>
          </div>

          {/* Botón */}
          <Link
            href="/collections"
            className={`mt-10 px-10 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black font-bold text-lg rounded-full hover:scale-110 transition-all duration-300 font-oswald z-10 ${
              animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ 
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
              fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            }}
          >
            Ver Colección
          </Link>
        </div>

        {/* Partículas */}
        {animationPhase >= 2 && (
          <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-amber-300 rounded-full animate-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  boxShadow: '0 0 4px rgba(212, 175, 55, 0.6)',
                }}
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <svg className="w-5 h-5 text-amber-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider font-oswald">Nuestra Historia</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-oswald">¿Quiénes Somos?</h2>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                <strong className="text-white">LookGod</strong> nació de una visión clara: crear moda que trascienda 
                lo superficial y conecte con el espíritu.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Cada prenda que creamos es más que tela y diseño. Es una declaración de principios, 
                un mensaje de esperanza, y una forma de llevar la luz de Dios a donde quiera que vayas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-amber-400 font-oswald text-lg">Fe</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-amber-400 font-oswald text-lg">Amor</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-amber-400 font-oswald text-lg">Esperanza</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-amber-400 font-oswald text-lg">Verdad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISIÓN Y PROPÓSITO */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900/30 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider font-oswald">Nuestra Visión</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-8 font-oswald">Nuestro Propósito</h2>
          <p className="text-xl text-gray-300 italic leading-relaxed">
            "Ser la marca que inspire a una generación a vestir con propósito, 
            llevando el mensaje de Dios en cada diseño."
          </p>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section id="categorias" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-oswald">Nuestras Categorías</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productosPorCategoria.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections?categoria=${cat.id}`}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400/30 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <h3 className="text-xl font-bold group-hover:text-amber-400 transition-colors font-oswald">{cat.nombre}</h3>
                  <p className="text-gray-400 text-sm">{cat.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-gray-900/30 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-oswald">Productos Destacados</h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No hay productos disponibles aún.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="group bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-amber-400/40 transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={product.image} alt={getProductName(product)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold group-hover:text-amber-400 transition-colors truncate font-oswald">{getProductName(product)}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{getProductDescription(product)}</p>
                    <span className="text-lg font-bold text-amber-400">{formatPrice(product.precio)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-400/10 to-transparent rounded-2xl p-8 border border-amber-400/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-amber-400 font-oswald">100%</p>
                <p className="text-gray-400 text-sm">Tela Premium</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-amber-400 font-oswald">+500</p>
                <p className="text-gray-400 text-sm">Clientes</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-amber-400 font-oswald">+50</p>
                <p className="text-gray-400 text-sm">Diseños</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-amber-400 font-oswald">1</p>
                <p className="text-gray-400 text-sm">Propósito</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENVÍO */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <h3 className="font-bold mb-1 font-oswald text-amber-400">Envío</h3>
            <p className="text-gray-400 text-sm">Medellín y municipios <span className="text-white font-bold">$15,000</span></p>
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-1 font-oswald text-amber-400">Rápido</h3>
            <p className="text-gray-400 text-sm">1-2 días hábiles</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-1 font-oswald text-amber-400">Seguro</h3>
            <p className="text-gray-400 text-sm">PayU / Mercado Pago</p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-4 font-oswald">¿Preguntas?</h2>
          <a href="mailto:lookgod@gmail.com" className="inline-block px-5 py-2 bg-amber-400/10 rounded-full text-amber-400 hover:bg-amber-400/20 transition-all">
            lookgod@gmail.com
          </a>
        </div>
      </section>

      {/* MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          open={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
          relatedProducts={getRelatedProducts(selectedProduct)}
        />
      )}
    </div>
  );
}

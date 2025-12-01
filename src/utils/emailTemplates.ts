export const userConfirmationTemplate = (name: string) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hola ${name}, 👋</h2>
    <p>
      ¡Gracias por contactarte con <strong>LookGood</strong>!  
      Hemos recibido tu mensaje y nuestro equipo se comunicará contigo pronto.
    </p>
    <p style="margin-top: 10px;">
      <em>Gracias por tu paciencia 💚</em><br />
      <strong>Equipo LookGood</strong>
    </p>
  </div>
`;

export const welcomeEmailTemplate = (name: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">¡Bienvenido a LookGod, ${name}! 🎉</h2>
    <p>
      Gracias por unirte a nuestra comunidad. Estamos emocionados de tenerte con nosotros.
    </p>
    <p>
      Como miembro de LookGod, ahora tienes acceso a:
    </p>
    <ul>
      <li>Descuentos exclusivos en productos seleccionados</li>
      <li>Ofertas especiales y promociones</li>
      <li>Nuevos modelos y lanzamientos antes que nadie</li>
    </ul>
    <p style="margin-top: 20px;">
      ¡Explora nuestra colección y encuentra el estilo perfecto para ti!
    </p>
    <p style="margin-top: 20px;">
      <em>Con amor,</em><br />
      <strong>El equipo de LookGod 💚</strong>
    </p>
  </div>
`;

export const dailyPromoEmailTemplate = (name: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">¡Hola ${name}! 🏍️</h2>
    <p>
      No te pierdas nuestras ofertas especiales de hoy:
    </p>
    <ul>
      <li>Descuentos en modelos seleccionados</li>
      <li>Nuevos productos disponibles</li>
      <li>Ofertas limitadas por tiempo</li>
    </ul>
    <p style="margin-top: 20px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/collections" 
         style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Ver Colección
      </a>
    </p>
    <p style="margin-top: 20px; font-size: 12px; color: #666;">
      Si no deseas recibir estos correos, puedes actualizar tus preferencias en tu perfil.
    </p>
  </div>
`;
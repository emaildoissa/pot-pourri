export const siteConfig = {
  name: "Pot. Pourri",
  fullName: "Pot. Pourri Pizzaria",
  tagline: "Refúgio Intimista em Porto Alegre",
  title: "Pot. Pourri Pizzaria — Refúgio Intimista em Porto Alegre",
  description:
    "Pizzas artesanais de massa finíssima cortada em formato xadrez, acompanhadas de salada fresca da casa, jazz ao vivo e carta de vinhos selecionada no coração de Porto Alegre.",
  locale: "pt_BR",
  defaultImage: "/og.png",
  address: {
    street: "Rua Furriel Luiz Antonio de Vargas, 250",
    neighborhood: "Bela Vista",
    locality: "Porto Alegre",
    region: "RS",
    postalCode: "90470-130",
    country: "Brasil",
  },
  phone: "+55 (51) 99999-9999",
  whatsapp: "5551999999999",
  whatsappUrl:
    "https://wa.me/5551999999999?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20uma%20mesa%20no%20Pot.%20Pourri%20Pizzaria.&utm_source=website&utm_medium=cta&utm_campaign=reserva_whatsapp",
  whatsappMenuUrl:
    "https://wa.me/5551999999999?text=Ol%C3%A1!%20Desejo%20visualizar%20o%20menu%20completo%20com%20valores%20atualizados%20do%20Pot.%20Pourri.&utm_source=website&utm_medium=menu_tab&utm_campaign=menu_completo",
  email: "contato@potpourripizzaria.com.br",
  nav: [
    { label: "O Conceito", href: "#conceito" },
    { label: "Experiência & Som", href: "#ambiente" },
    { label: "Menu Digital", href: "#menu" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Contato & Local", href: "#contato" },
  ],
  hours: {
    serviceDays: "Terça a Domingo",
    seatings: "19:00 às 23:30",
    closed: "Segunda-feira",
    schema: {
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "19:00",
      closes: "23:30",
    },
  },
  restaurant: {
    priceRange: "$$",
    cuisine: ["Pizza Artesanal", "Massa Fina", "Jazz Bar", "Vinhos"],
  },
  effects: {
    reveal: true,
  },
  social: [
    { label: "Instagram", href: "https://www.instagram.com/potpourripizzaria" },
    { label: "TripAdvisor", href: "https://www.tripadvisor.com" },
    { label: "Google Business", href: "https://maps.google.com" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "eco-001",
    name: "Encanto Solitário",
    price: 24.99,
    category: "Linha Econômica",
    description: "Uma única rosa cuidadosamente selecionada, símbolo de amor, apreço e admiração.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/romantic-roses-display-a4ZLasTMUujywUVaMdtdGx.webp",
  },
  {
    id: "eco-002",
    name: "Romance Rústico",
    price: 39.99,
    category: "Linha Econômica",
    description: "Uma rosa cuidadosamente embalada em juta, combinando simplicidade e beleza rústica.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/romantic-roses-display-a4ZLasTMUujywUVaMdtdGx.webp",
  },
  {
    id: "eco-003",
    name: "Brilho do Dia",
    price: 39.99,
    category: "Linha Econômica",
    description: "Um lindo ramalhete de girassóis, trazendo energia vibrante e o calor do sol.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/sunflower-collection-DP2U635HqhmtxKuJRKxnxv.webp",
  },
  {
    id: "eco-004",
    name: "Dois Corações",
    price: 59.99,
    category: "Linha Econômica",
    description: "Ramalhete com 2 rosas vermelhas embaladas em juta, evocando romance e elegância.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/romantic-roses-display-a4ZLasTMUujywUVaMdtdGx.webp",
  },
  {
    id: "eco-005",
    name: "Raios de Sol",
    price: 59.99,
    category: "Linha Econômica",
    description: "Ramalhete de girassol embalado em juta, irradiando alegria e luminosidade.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/sunflower-collection-DP2U635HqhmtxKuJRKxnxv.webp",
  },
  {
    id: "eco-006",
    name: "Buquê Van Gogh G2",
    price: 49.99,
    category: "Linha Econômica",
    description: "Dois girassóis vibrantes que evocam a beleza vívida das obras de Van Gogh.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/sunflower-collection-DP2U635HqhmtxKuJRKxnxv.webp",
  },
  {
    id: "pad-001",
    name: "Brilho Solar",
    price: 119.99,
    category: "Linha Padrão",
    description: "Buquê com três girassóis vibrantes que irradiam alegria e positividade.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/sunflower-collection-DP2U635HqhmtxKuJRKxnxv.webp",
  },
  {
    id: "pad-002",
    name: "Amor Suave",
    price: 119.99,
    category: "Linha Padrão",
    description: "Buquê com três rosas cor-de-rosa, simbolizando carinho, doçura e admiração.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/hero-flowers-arrangement-B7HQEL3dXch4TfsfBxmzLH.webp",
  },
  {
    id: "pad-003",
    name: "Flor da Paixão",
    price: 119.99,
    category: "Linha Padrão",
    description: "Buquê com 3 rosas vermelhas, expressão de carinho e romance apaixonado.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/romantic-roses-display-a4ZLasTMUujywUVaMdtdGx.webp",
  },
  {
    id: "pad-004",
    name: "Pérolas Encantadoras",
    price: 119.99,
    category: "Linha Padrão",
    description: "Buquê com três rosas brancas, simbolizando pureza, sinceridade e respeito.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/hero-flowers-arrangement-B7HQEL3dXch4TfsfBxmzLH.webp",
  },
  {
    id: "pad-005",
    name: "Oceano de Amor",
    price: 129.99,
    category: "Linha Padrão",
    description: "Buquê com três rosas azuis, evocando serenidade, confiança e busca de sonhos.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/hero-flowers-arrangement-B7HQEL3dXch4TfsfBxmzLH.webp",
  },
  {
    id: "pad-006",
    name: "Ternura Vibrante",
    price: 119.99,
    category: "Linha Padrão",
    description: "Buquê com três rosas pink, irradiando energia, alegria e gratidão.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/hero-flowers-arrangement-B7HQEL3dXch4TfsfBxmzLH.webp",
  },
  {
    id: "prem-001",
    name: "Buquê Girassol Premium",
    price: 199.99,
    category: "Linha Premium",
    description: "Arranjo premium com girassóis selecionados, perfeito para ocasiões especiais.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/sunflower-collection-DP2U635HqhmtxKuJRKxnxv.webp",
  },
  {
    id: "prem-002",
    name: "Caixa Surpresa",
    price: 199.99,
    category: "Linha Premium",
    description: "Caixa com vinho Pérgola, Ferrero Rocher e urso Pompozinho, um presente completo.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "excl-001",
    name: "Aceita namorar comigo?",
    price: 299.99,
    category: "Linha Exclusiva",
    description: "Caixa redonda com rosas vermelhas e Ferrero Rocher, perfeita para pedidos de namoro.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "luxo-001",
    name: "Caixa Luxo Especial",
    price: 349.99,
    category: "Linha Luxo",
    description: "Combinação premium com flores, chocolates, frutas e complementos de luxo.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "mimo-001",
    name: "Pelúcia Modelo Surpresa",
    price: 39.99,
    category: "Mimos",
    description: "Pelúcia sortida enviada de forma aleatória conforme disponibilidade.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "mimo-002",
    name: "Almofada Coração Eu Te Amo",
    price: 49.99,
    category: "Mimos",
    description: "Almofada em formato de coração com frase bordada Eu Te Amo, tamanho 18 cm.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "mimo-003",
    name: "Urso Pompom",
    price: 49.99,
    category: "Mimos",
    description: "Urso de pelúcia macio de 13 cm, perfeito para acompanhar buquês e presentes.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "mimo-004",
    name: "Stitch Azul",
    price: 49.99,
    category: "Mimos",
    description: "Pelúcia adorável do personagem Stitch em azul, com 22 cm.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "mimo-005",
    name: "Stitch Rosa",
    price: 49.99,
    category: "Mimos",
    description: "Pelúcia encantadora do Stitch em rosa, com 22 cm e toque delicado.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "mimo-006",
    name: "Urso Teddy",
    price: 149.99,
    category: "Mimos",
    description: "Urso de pelúcia grande de 50 cm com pelagem suave em tons de caramelo.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/gift-boxes-collection-GWgc8DLkNtPe3gVs9fq32.webp",
  },
  {
    id: "flor-001",
    name: "Pétalas de Rosas",
    price: 15.99,
    category: "Flores Avulsas",
    description: "Pétalas de rosas soltas para compor arranjos e momentos especiais.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/romantic-roses-display-a4ZLasTMUujywUVaMdtdGx.webp",
  },
  {
    id: "flor-002",
    name: "Rosa Avulsa",
    price: 12.99,
    category: "Flores Avulsas",
    description: "Apenas a flor, sem complementos, perfeita para criar arranjos personalizados.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663126953922/UaLHnuZV4YjTR6Z8uDz7Th/romantic-roses-display-a4ZLasTMUujywUVaMdtdGx.webp",
  },
];

export const categories = [
  "Linha Econômica",
  "Linha Padrão",
  "Linha Premium",
  "Linha Exclusiva",
  "Linha Luxo",
  "Mimos",
  "Flores Avulsas",
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

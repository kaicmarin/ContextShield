import type { Category, Product } from '../types/domain'
import { IDS } from './ids'
export const categories: Category[] = [
  { slug: 'informatica', name: 'Informática', blurb: 'Notebooks, monitores e periféricos para trabalhar bem.' },
  { slug: 'celulares', name: 'Celulares e tablets', blurb: 'Telas nítidas, câmeras sérias e bateria para o dia todo.' },
  { slug: 'audio', name: 'Áudio', blurb: 'Fones e caixas com som limpo, em casa ou na rua.' },
  { slug: 'games', name: 'Games', blurb: 'Consoles e controles para jogar com calma ou com pressa.' },
  { slug: 'foto', name: 'Câmeras e foto', blurb: 'Câmeras e lentes para quem leva a imagem a sério.' },
  { slug: 'casa', name: 'Casa conectada', blurb: 'Segurança e limpeza automáticas para uma casa mais simples.' },
  { slug: 'eletrodomesticos', name: 'Eletroportáteis', blurb: 'Cozinha rápida, café bom e menos louça na pia.' },
  { slug: 'escritorio', name: 'Escritório', blurb: 'Cadeiras, luz e organização para o home office.' },
  { slug: 'ferramentas', name: 'Ferramentas', blurb: 'Para pendurar, montar e consertar sem chamar ninguém.' },
  { slug: 'acessorios', name: 'Acessórios', blurb: 'Carregadores, mochilas e o que acompanha você.' },
]

// a constante/variável S e atribui a ela o resultado da expressão desta linha.
const S = (label: string, value: string) => ({ label, value })
export const products: Product[] = [
  {
    id: 'prod-001', sku: 'NX-ORX14-16-512', name: 'Notebook Orion X 14', line: '16 GB · SSD 512 GB', categorySlug: 'informatica', kind: 'notebook', sellerId: IDS.sellerNexa,
    price: 4799.9, oldPrice: 5299.9, installments: 10, rating: 4.8, reviewCount: 1284, stock: 23, deliveryDays: 2, finish: 'silver', tag: 'Mais vendido',
    description: 'Chassi em alumínio, tela de 14 polegadas com cores precisas e bateria para um dia inteiro de trabalho. Leve o bastante para ir com você, firme o bastante para durar.',
    highlights: ['Tela 14" 2.8K a 120 Hz', 'Até 16 h de bateria', '1,28 kg em alumínio'],
    specs: [S('Processador', '10 núcleos, até 4,6 GHz'), S('Memória', '16 GB LPDDR5'), S('Armazenamento', 'SSD 512 GB NVMe'), S('Tela', '14" 2.8K, 120 Hz'), S('Peso', '1,28 kg'), S('Garantia', '12 meses')],
  },
  {
    id: 'prod-002', sku: 'NX-NVP-256', name: 'Smartphone Nova Pro', line: '256 GB · Grafite', categorySlug: 'celulares', kind: 'phone', sellerId: IDS.sellerNexa,
    price: 3499.9, oldPrice: 3899.9, installments: 10, rating: 4.7, reviewCount: 2311, stock: 41, deliveryDays: 1, finish: 'graphite', tag: 'Lançamento',
    description: 'Tela OLED de 6,7", câmera tripla e recarga rápida. Um telefone nítido, discreto e resistente à água.',
    highlights: ['OLED 6,7" a 120 Hz', 'Câmera principal de 108 MP', 'Resistência IP68'],
    specs: [S('Tela', 'OLED 6,7", 120 Hz'), S('Armazenamento', '256 GB'), S('Câmeras', '108 + 12 + 10 MP'), S('Bateria', '5.000 mAh'), S('Resistência', 'IP68'), S('Garantia', '12 meses')],
  },
  {
    id: 'prod-003', sku: 'EO-PULSE-ANC', name: 'Headset Pulse ANC', line: 'Cancelamento ativo · Areia', categorySlug: 'audio', kind: 'headset', sellerId: IDS.sellerOnda,
    price: 429.9, oldPrice: 499.9, installments: 5, rating: 4.6, reviewCount: 842, stock: 58, deliveryDays: 3, finish: 'sand',
    description: 'Cancelamento de ruído ativo, almofadas macias e até 30 horas de uso. Para reuniões longas e viagens mais silenciosas.',
    highlights: ['Cancelamento de ruído ativo', 'Até 30 h de bateria', 'Multiponto Bluetooth 5.3'],
    specs: [S('Conexão', 'Bluetooth 5.3 multiponto'), S('Bateria', 'até 30 h'), S('Recarga', 'USB-C, 10 min = 5 h'), S('Peso', '248 g')],
  },
  {
    id: 'prod-004', sku: 'EN-VIS27-QHD', name: 'Monitor Vision 27', line: 'QHD · 144 Hz · USB-C', categorySlug: 'informatica', kind: 'monitor', sellerId: IDS.sellerNorte,
    price: 1799.9, oldPrice: 2099.9, installments: 10, rating: 4.7, reviewCount: 516, stock: 18, deliveryDays: 4, finish: 'graphite',
    description: '27 polegadas, painel IPS QHD e 144 Hz. Um monitor limpo, com cores fiéis e sem brilho excessivo.',
    highlights: ['27" QHD IPS', '144 Hz', 'USB-C com 65 W'],
    specs: [S('Painel', 'IPS 27" 2560×1440'), S('Taxa', '144 Hz'), S('Conexões', 'USB-C 65 W, HDMI, DisplayPort'), S('Ajuste', 'Altura, inclinação e rotação')],
  },
  {
    id: 'prod-005', sku: 'EG-VTX-1TB', name: 'Console Vertex', line: 'SSD 1 TB · controle incluso', categorySlug: 'games', kind: 'console', sellerId: IDS.sellerGames,
    price: 3999.9, oldPrice: 4299.9, installments: 10, rating: 4.9, reviewCount: 3020, stock: 9, deliveryDays: 2, finish: 'white', tag: 'Últimas unidades',
    description: 'Jogos em 4K, carregamento rápido e um controle que parece feito para a sua mão.',
    highlights: ['Até 4K a 120 fps', 'SSD de 1 TB', 'Controle sem fio incluso'],
    specs: [S('Resolução', 'até 4K, 120 fps'), S('Armazenamento', 'SSD 1 TB'), S('Mídia', 'Digital'), S('Garantia', '12 meses')],
  },
  {
    id: 'prod-006', sku: 'NX-FLOW2-40', name: 'Smartwatch Flow 2', line: 'Caixa 40 mm · GPS', categorySlug: 'celulares', kind: 'watch', sellerId: IDS.sellerNexa,
    price: 899.9, oldPrice: 1099.9, installments: 10, rating: 4.5, reviewCount: 1106, stock: 34, deliveryDays: 1, finish: 'sage',
    description: 'Caixa fina, GPS integrado e monitoramento de sono e atividade. Uma semana longe do carregador.',
    highlights: ['GPS integrado', 'Resistência 5 ATM', 'Até 7 dias de bateria'],
    specs: [S('Tela', 'AMOLED 1,4"'), S('Resistência', '5 ATM'), S('Bateria', 'até 7 dias'), S('Sensores', 'Frequência cardíaca, SpO2')],
  },
  {
    id: 'prod-007', sku: 'EO-AIRS-ANC', name: 'Fones Air Sense', line: 'In-ear · ANC adaptativo', categorySlug: 'audio', kind: 'earbuds', sellerId: IDS.sellerOnda,
    price: 599.9, oldPrice: 699.9, installments: 6, rating: 4.6, reviewCount: 1932, stock: 72, deliveryDays: 2, finish: 'white',
    description: 'Fones intra-auriculares com ajuste firme, estojo compacto e chamadas claras mesmo na rua.',
    highlights: ['ANC adaptativo', '28 h com o estojo', 'Resistência IPX4'],
    specs: [S('Bateria', '7 h + 21 h no estojo'), S('Resistência', 'IPX4'), S('Conexão', 'Bluetooth 5.3'), S('Estojo', 'USB-C e sem fio')],
  },
  {
    id: 'prod-008', sku: 'EO-DRIFT-40', name: 'Caixa de som Drift', line: '360° · IP67', categorySlug: 'audio', kind: 'speaker', sellerId: IDS.sellerOnda,
    price: 699.9, installments: 6, rating: 4.7, reviewCount: 604, stock: 25, deliveryDays: 3, finish: 'sage',
    description: 'Som de 360°, graves firmes e bateria para o fim de semana. Resistente a respingos e poeira.',
    highlights: ['Som em 360°', 'Até 24 h de bateria', 'Resistência IP67'],
    specs: [S('Potência', '40 W RMS'), S('Bateria', 'até 24 h'), S('Resistência', 'IP67'), S('Peso', '980 g')],
  },
  {
    id: 'prod-009', sku: 'EN-ARC-LP', name: 'Teclado mecânico Arc', line: 'Perfil baixo · silencioso', categorySlug: 'informatica', kind: 'keyboard', sellerId: IDS.sellerNorte,
    price: 549.9, oldPrice: 629.9, installments: 5, rating: 4.8, reviewCount: 377, stock: 30, deliveryDays: 3, finish: 'graphite',
    description: 'Teclado mecânico de perfil baixo, silencioso e com conexão para três dispositivos.',
    highlights: ['Switches lineares silenciosos', 'Três dispositivos', 'Retroiluminação ajustável'],
    specs: [S('Switches', 'Lineares silenciosos'), S('Conexão', 'Bluetooth e USB-C'), S('Layout', 'ABNT2'), S('Bateria', 'até 3 meses sem luz')],
  },
  {
    id: 'prod-010', sku: 'EN-GLIDE-W', name: 'Mouse Glide sem fio', line: 'Ergonômico · 8.000 DPI', categorySlug: 'informatica', kind: 'mouse', sellerId: IDS.sellerNorte,
    price: 249.9, installments: 3, rating: 4.6, reviewCount: 1245, stock: 88, deliveryDays: 2, finish: 'graphite',
    description: 'Ergonômico, preciso e com rolagem livre para planilhas longas.',
    highlights: ['Sensor de 8.000 DPI', 'Rolagem livre', 'Até 70 dias de bateria'],
    specs: [S('Sensor', '8.000 DPI'), S('Conexão', 'Bluetooth e receptor USB'), S('Bateria', 'até 70 dias')],
  },
  {
    id: 'prod-011', sku: 'CP-HALO-2K', name: 'Câmera de segurança Halo', line: '2K · visão noturna', categorySlug: 'casa', kind: 'camera', sellerId: IDS.sellerCasa,
    price: 459.9, oldPrice: 529.9, installments: 5, rating: 4.4, reviewCount: 688, stock: 26, deliveryDays: 3, finish: 'white',
    description: 'Câmera interna 2K com visão noturna e privacidade física: a lente recolhe quando você chega.',
    highlights: ['Imagem 2K', 'Visão noturna', 'Lente recolhível'],
    specs: [S('Resolução', '2K'), S('Campo de visão', '110°'), S('Armazenamento', 'microSD ou nuvem'), S('Conexão', 'Wi-Fi 2,4 GHz')],
  },
  {
    id: 'prod-012', sku: 'EG-VTX-CTRL', name: 'Controle Vertex sem fio', line: 'Gatilhos adaptáveis', categorySlug: 'games', kind: 'controller', sellerId: IDS.sellerGames,
    price: 449.9, installments: 5, rating: 4.8, reviewCount: 2140, stock: 44, deliveryDays: 2, finish: 'midnight',
    description: 'Gatilhos adaptáveis e vibração precisa. Compatível com o Console Vertex e com PC.',
    highlights: ['Gatilhos adaptáveis', 'Até 40 h de bateria', 'USB-C'],
    specs: [S('Bateria', 'até 40 h'), S('Conexão', 'Sem fio e USB-C'), S('Compatibilidade', 'Console Vertex e PC')],
  },
  {
    id: 'prod-013', sku: 'NX-SLATE11-128', name: 'Tablet Slate 11', line: '128 GB · Wi-Fi', categorySlug: 'celulares', kind: 'tablet', sellerId: IDS.sellerNexa,
    price: 2499.9, oldPrice: 2799.9, installments: 10, rating: 4.6, reviewCount: 731, stock: 19, deliveryDays: 2, finish: 'silver',
    description: 'Tela de 11" com cores fiéis, caneta com baixa latência e bateria para um dia de aulas.',
    highlights: ['Tela 11" 2.5K', 'Compatível com caneta', 'Até 12 h de bateria'],
    specs: [S('Tela', 'LCD 11" 2.5K, 90 Hz'), S('Armazenamento', '128 GB'), S('Conexão', 'Wi-Fi 6'), S('Peso', '480 g')],
  },
  {
    id: 'prod-014', sku: 'EO-M50-1545', name: 'Câmera mirrorless Onda M50', line: 'Com lente 15–45 mm', categorySlug: 'foto', kind: 'mirrorless', sellerId: IDS.sellerOnda,
    price: 3199, oldPrice: 3599, installments: 10, rating: 4.8, reviewCount: 289, stock: 11, deliveryDays: 3, finish: 'graphite',
    description: 'Sensor APS-C de 24 MP, foco automático rápido e vídeo 4K. Leve para viajar, séria o bastante para trabalhar.',
    highlights: ['Sensor APS-C 24 MP', 'Vídeo 4K', 'Tela articulada'],
    specs: [S('Sensor', 'APS-C 24,1 MP'), S('Vídeo', '4K 30p'), S('Lente', '15–45 mm f/3.5–6.3'), S('Peso', '387 g (corpo)')],
  },
  {
    id: 'prod-015', sku: 'CP-BRASA-5L', name: 'Fritadeira elétrica Brasa', line: '5 litros · 1.500 W', categorySlug: 'eletrodomesticos', kind: 'airfryer', sellerId: IDS.sellerCasa,
    price: 399.9, oldPrice: 549.9, installments: 5, rating: 4.7, reviewCount: 4812, stock: 64, deliveryDays: 2, finish: 'graphite', tag: 'Oferta do dia',
    description: 'Cesto de 5 litros antiaderente, painel digital e oito programas prontos. Menos óleo, mesma crocância.',
    highlights: ['Cesto de 5 L', 'Painel digital', '8 programas automáticos'],
    specs: [S('Capacidade', '5 L'), S('Potência', '1.500 W'), S('Voltagem', '127 V ou 220 V'), S('Temperatura', '80 °C a 200 °C')],
  },
  {
    id: 'prod-016', sku: 'CP-AROMA-15', name: 'Cafeteira espresso Aroma', line: '15 bar · vaporizador', categorySlug: 'eletrodomesticos', kind: 'espresso', sellerId: IDS.sellerCasa,
    price: 899.9, oldPrice: 1049.9, installments: 8, rating: 4.6, reviewCount: 953, stock: 21, deliveryDays: 3, finish: 'silver',
    description: 'Bomba de 15 bar, vaporizador para leite e reservatório removível. Café de padaria na cozinha de casa.',
    highlights: ['Pressão de 15 bar', 'Vaporizador de leite', 'Reservatório de 1,2 L'],
    specs: [S('Pressão', '15 bar'), S('Reservatório', '1,2 L'), S('Potência', '1.350 W'), S('Material', 'Aço escovado')],
  },
  {
    id: 'prod-017', sku: 'CP-ORBITA-R', name: 'Robô aspirador Órbita', line: 'Mapeamento a laser', categorySlug: 'casa', kind: 'robot', sellerId: IDS.sellerCasa,
    price: 1499.9, oldPrice: 1899.9, installments: 10, rating: 4.5, reviewCount: 1377, stock: 15, deliveryDays: 4, finish: 'white',
    description: 'Mapeia a casa a laser, aspira e passa pano. Volta sozinho para a base quando termina.',
    highlights: ['Mapeamento a laser', 'Aspira e passa pano', 'Controle pelo app'],
    specs: [S('Sucção', '4.000 Pa'), S('Autonomia', 'até 150 min'), S('Navegação', 'LiDAR'), S('Reservatório', '450 ml')],
  },
  {
    id: 'prod-018', sku: 'EN-ATLAS-ERG', name: 'Cadeira ergonômica Atlas', line: 'Encosto em tela · apoio lombar', categorySlug: 'escritorio', kind: 'chair', sellerId: IDS.sellerNorte,
    price: 1290, oldPrice: 1590, installments: 10, rating: 4.6, reviewCount: 402, stock: 12, deliveryDays: 5, finish: 'graphite',
    description: 'Encosto em tela respirável, apoio lombar ajustável e braços 4D. Para jornadas longas sem dor nas costas.',
    highlights: ['Apoio lombar ajustável', 'Braços 4D', 'Suporta até 130 kg'],
    specs: [S('Encosto', 'Tela respirável'), S('Ajustes', 'Altura, lombar, braços 4D'), S('Carga máxima', '130 kg'), S('Garantia', '3 anos na estrutura')],
  },
  {
    id: 'prod-019', sku: 'EN-FARO-LED', name: 'Luminária de mesa Faro', line: 'LED · temperatura ajustável', categorySlug: 'escritorio', kind: 'lamp', sellerId: IDS.sellerNorte,
    price: 189.9, installments: 2, rating: 4.7, reviewCount: 318, stock: 47, deliveryDays: 2, finish: 'sand',
    description: 'Braço articulado, cinco temperaturas de cor e base com carregador USB-C.',
    highlights: ['5 temperaturas de cor', 'Braço articulado', 'Base com USB-C'],
    specs: [S('Potência', '10 W LED'), S('Temperatura', '2.700 K a 6.500 K'), S('Alimentação', 'Bivolt')],
  },
  {
    id: 'prod-020', sku: 'FC-TORQUE-12', name: 'Parafusadeira Torque 12 V', line: '2 baterias · maleta', categorySlug: 'ferramentas', kind: 'drill', sellerId: IDS.sellerFerramenta,
    price: 379.9, oldPrice: 449.9, installments: 5, rating: 4.8, reviewCount: 1566, stock: 39, deliveryDays: 3, finish: 'sage',
    description: 'Compacta, com duas baterias e 18 ajustes de torque. Monta móveis e fura parede sem esforço.',
    highlights: ['Duas baterias inclusas', '18 ajustes de torque', 'Luz LED frontal'],
    specs: [S('Tensão', '12 V'), S('Torque', 'até 30 Nm'), S('Mandril', '10 mm'), S('Itens', '2 baterias, carregador e maleta')],
  },
  {
    id: 'prod-021', sku: 'FC-OFIC-110', name: 'Jogo de ferramentas Oficina', line: '110 peças · maleta', categorySlug: 'ferramentas', kind: 'toolkit', sellerId: IDS.sellerFerramenta,
    price: 289.9, oldPrice: 349.9, installments: 4, rating: 4.7, reviewCount: 822, stock: 53, deliveryDays: 3, finish: 'clay',
    description: 'Chaves, soquetes e bits em aço cromo-vanádio, organizados em maleta rígida.',
    highlights: ['110 peças', 'Aço cromo-vanádio', 'Maleta rígida'],
    specs: [S('Peças', '110'), S('Material', 'Cromo-vanádio'), S('Maleta', 'Polipropileno com trava')],
  },
  {
    id: 'prod-022', sku: 'NX-VOLT-20K', name: 'Carregador portátil Volt', line: '20.000 mAh · 30 W', categorySlug: 'acessorios', kind: 'powerbank', sellerId: IDS.sellerNexa,
    price: 219.9, oldPrice: 259.9, installments: 3, rating: 4.6, reviewCount: 2874, stock: 120, deliveryDays: 1, finish: 'graphite',
    description: 'Carrega o celular quatro vezes e o notebook uma vez. Duas saídas USB-C e visor de carga.',
    highlights: ['20.000 mAh', 'Recarga rápida 30 W', 'Duas saídas USB-C'],
    specs: [S('Capacidade', '20.000 mAh'), S('Potência', '30 W'), S('Saídas', '2× USB-C, 1× USB-A'), S('Peso', '360 g')],
  },
  {
    id: 'prod-023', sku: 'EN-URB-15', name: 'Mochila Urbana 15"', line: 'Impermeável · compartimento acolchoado', categorySlug: 'acessorios', kind: 'backpack', sellerId: IDS.sellerNorte,
    price: 329.9, installments: 4, rating: 4.7, reviewCount: 511, stock: 36, deliveryDays: 3, finish: 'midnight',
    description: 'Tecido impermeável, compartimento acolchoado para notebook de até 15" e bolso antifurto nas costas.',
    highlights: ['Compartimento para 15"', 'Tecido impermeável', 'Bolso antifurto'],
    specs: [S('Capacidade', '22 L'), S('Notebook', 'até 15,6"'), S('Material', 'Poliéster reciclado')],
  },
  {
    id: 'prod-024', sku: 'CO-NVP-256-LAC', name: 'Smartphone Nova Pro', line: '256 GB · lacrado', categorySlug: 'celulares', kind: 'phone', sellerId: IDS.sellerConecta,
    price: 3299, oldPrice: 3899.9, installments: 12, rating: 4.1, reviewCount: 21, stock: 6, deliveryDays: 1, finish: 'midnight',
    description: 'Smartphone Nova Pro com tela OLED de 6,7 polegadas, 256 GB de armazenamento e pronta entrega.',
    highlights: ['Lacrado com nota fiscal', 'Pronta entrega', 'Retirada disponível'],
    specs: [S('Tela', 'OLED 6,7", 120 Hz'), S('Armazenamento', '256 GB'), S('Garantia', '90 dias do vendedor')],
  },
  {
    id: 'prod-025', sku: 'CO-ORX14-PE', name: 'Notebook Orion X 14', line: '16 GB · pronta entrega', categorySlug: 'informatica', kind: 'notebook', sellerId: IDS.sellerConecta,
    price: 4390, oldPrice: 5299.9, installments: 12, rating: 4, reviewCount: 9, stock: 3, deliveryDays: 1, finish: 'graphite',
    description: 'Notebook Orion X 14 com 16 GB e SSD de 512 GB. Unidades lacradas, envio no mesmo dia.',
    highlights: ['Lacrado', 'Envio no mesmo dia', 'Retirada disponível'],
    specs: [S('Memória', '16 GB'), S('Armazenamento', 'SSD 512 GB'), S('Garantia', '90 dias do vendedor')],
  },
  {
    id: 'prod-026', sku: 'CO-SLATE11-LAC', name: 'Tablet Slate 11', line: '128 GB · lacrado', categorySlug: 'celulares', kind: 'tablet', sellerId: IDS.sellerConecta,
    price: 2099, oldPrice: 2799.9, installments: 12, rating: 4.2, reviewCount: 14, stock: 5, deliveryDays: 1, finish: 'graphite',
    description: 'Tablet Slate 11 lacrado, 128 GB. Envio imediato e retirada em ponto parceiro.',
    highlights: ['Lacrado', 'Envio imediato', 'Retirada em ponto parceiro'],
    specs: [S('Tela', '11" 2.5K'), S('Armazenamento', '128 GB'), S('Garantia', '90 dias do vendedor')],
  },
  {
    id: 'prod-027', sku: 'PE-AIRS-IMP', name: 'Fones Air Sense', line: 'Versão importada', categorySlug: 'audio', kind: 'earbuds', sellerId: IDS.sellerPrime,
    price: 389, oldPrice: 699.9, installments: 6, rating: 3.9, reviewCount: 147, stock: 40, deliveryDays: 6, finish: 'graphite',
    description: 'Versão importada dos Fones Air Sense. Manual em inglês e carregador com adaptador.',
    highlights: ['Versão importada', 'Estojo de recarga', 'Envio de São Paulo'],
    specs: [S('Bateria', '7 h + 21 h no estojo'), S('Garantia', '90 dias do vendedor')],
  },
  {
    id: 'prod-028', sku: 'PE-FLOW2-IMP', name: 'Smartwatch Flow 2', line: 'Versão importada · 44 mm', categorySlug: 'celulares', kind: 'watch', sellerId: IDS.sellerPrime,
    price: 649, oldPrice: 1099.9, installments: 6, rating: 3.8, reviewCount: 96, stock: 22, deliveryDays: 7, finish: 'midnight',
    description: 'Versão importada do Smartwatch Flow 2, caixa de 44 mm. Pulseira extra inclusa.',
    highlights: ['Caixa de 44 mm', 'Pulseira extra', 'Versão importada'],
    specs: [S('Tela', 'AMOLED 1,6"'), S('Bateria', 'até 6 dias'), S('Garantia', '90 dias do vendedor')],
  },
]

// a constante/variável map e atribui a ela o resultado da expressão desta linha.
const map = new Map(products.map((p) => [p.id, p]))
export const getProductById = (id: string) => map.get(id)
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)
export const productsByCategory = (slug: string) => products.filter((p) => p.categorySlug === slug)
export const productsBySeller = (sellerId: string) => products.filter((p) => p.sellerId === sellerId)
export function discountPercent(p: Product): number {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0
}
export function stockLabel(p: Product): { text: string; tone: 'ok' | 'warn' | 'risk' } {
  // Verifica a condição antes de executar o bloco seguinte.
  if (p.stock <= 0) return { text: 'Indisponível', tone: 'risk' }
  // Verifica a condição antes de executar o bloco seguinte.
  if (p.stock <= 6) return { text: `Últimas ${p.stock} unidades`, tone: 'warn' }
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return { text: 'Em estoque', tone: 'ok' }
}
export function deliveryLabel(days: number): string {
  // Verifica a condição antes de executar o bloco seguinte.
  if (days <= 1) return 'Chega amanhã'
  // Verifica a condição antes de executar o bloco seguinte.
  if (days === 2) return 'Chega em 2 dias úteis'
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return `Chega em até ${days} dias úteis`
}
export const FREE_SHIPPING_FROM = 299
export function shippingFor(subtotal: number): number {
  // Verifica a condição antes de executar o bloco seguinte.
  if (subtotal <= 0) return 0
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return subtotal >= FREE_SHIPPING_FROM ? 0 : 24.9
}

// a constante/variável reviewBank e atribui a ela o resultado da expressão desta linha.
const reviewBank: Record<string, { name: string; rating: number; title: string; body: string; when: string }[]> = {
  informatica: [
    { name: 'Luiza C.', rating: 5, title: 'Rápido e silencioso', body: 'Uso para trabalho o dia inteiro e não esquenta. A tela é muito boa para planilhas.', when: '12 set 2026' },
    { name: 'Marcos T.', rating: 4, title: 'Bom custo-benefício', body: 'Chegou antes do prazo e bem embalado. Só senti falta de mais portas.', when: '03 set 2026' },
    { name: 'Renata P.', rating: 5, title: 'Recomendo', body: 'Configuração simples, funcionou de primeira no meu notebook.', when: '21 ago 2026' },
  ],
  celulares: [
    { name: 'Gustavo L.', rating: 5, title: 'Bateria excelente', body: 'Termino o dia com mais de 30%. A câmera noturna surpreendeu.', when: '15 set 2026' },
    { name: 'Paula R.', rating: 4, title: 'Muito bom', body: 'Tela linda. O carregador não vem na caixa, vale saber antes.', when: '06 set 2026' },
    { name: 'André S.', rating: 4, title: 'Entrega rápida', body: 'Produto original, com nota fiscal. Configurei em minutos.', when: '28 ago 2026' },
  ],
  audio: [
    { name: 'Camila F.', rating: 5, title: 'Silêncio no metrô', body: 'O cancelamento de ruído funciona de verdade. Confortável por horas.', when: '18 set 2026' },
    { name: 'Rodrigo M.', rating: 4, title: 'Som equilibrado', body: 'Graves na medida. O app poderia ter mais opções de equalização.', when: '09 set 2026' },
    { name: 'Talita B.', rating: 5, title: 'Chamadas claras', body: 'Uso em reuniões e ninguém reclama do barulho da rua.', when: '30 ago 2026' },
  ],
  games: [
    { name: 'Felipe A.', rating: 5, title: 'Carrega muito rápido', body: 'Os jogos abrem em segundos. Silencioso mesmo depois de horas.', when: '20 set 2026' },
    { name: 'Bruna K.', rating: 5, title: 'Controle excelente', body: 'A vibração faz diferença. Bateria dura bastante.', when: '11 set 2026' },
    { name: 'Thiago N.', rating: 4, title: 'Veio certinho', body: 'Embalagem lacrada e entrega no prazo.', when: '02 set 2026' },
  ],
  foto: [
    { name: 'Isabela V.', rating: 5, title: 'Leve e nítida', body: 'Levei numa viagem e voltei com fotos lindas. O foco é rápido.', when: '14 set 2026' },
    { name: 'Caio D.', rating: 4, title: 'Ótima para começar', body: 'A lente do kit é versátil. O menu leva um tempo para acostumar.', when: '01 set 2026' },
    { name: 'Helô M.', rating: 5, title: 'Vídeo 4K impecável', body: 'Uso para gravar aulas e a qualidade é ótima.', when: '19 ago 2026' },
  ],
  casa: [
    { name: 'Sérgio P.', rating: 4, title: 'Fácil de instalar', body: 'Conectou no Wi-Fi sem dificuldade. O app avisa rápido.', when: '16 set 2026' },
    { name: 'Nádia O.', rating: 5, title: 'Casa limpa todo dia', body: 'Programo para limpar quando saio. Desvia bem dos móveis.', when: '07 set 2026' },
    { name: 'Leandro G.', rating: 4, title: 'Cumpre o que promete', body: 'Imagem noturna boa. Poderia ter mais opções de gravação.', when: '25 ago 2026' },
  ],
  eletrodomesticos: [
    { name: 'Marina Q.', rating: 5, title: 'Uso todos os dias', body: 'Batata crocante sem óleo e cesto fácil de lavar.', when: '17 set 2026' },
    { name: 'Otávio R.', rating: 4, title: 'Café encorpado', body: 'O vaporizador faz uma espuma boa. Esquenta rápido.', when: '05 set 2026' },
    { name: 'Priscila H.', rating: 5, title: 'Compra certa', body: 'Silenciosa e bonita na bancada.', when: '27 ago 2026' },
  ],
  escritorio: [
    { name: 'Vinícius E.', rating: 5, title: 'Acabou a dor nas costas', body: 'O apoio lombar ajustável faz diferença em jornadas longas.', when: '13 set 2026' },
    { name: 'Larissa J.', rating: 4, title: 'Boa luz', body: 'A temperatura de cor ajuda no fim do dia. Montagem simples.', when: '04 set 2026' },
    { name: 'Eduardo C.', rating: 4, title: 'Bem construída', body: 'Material firme. A montagem levou uns 20 minutos.', when: '22 ago 2026' },
  ],
  ferramentas: [
    { name: 'Roberto S.', rating: 5, title: 'Resolve tudo em casa', body: 'Montei um guarda-roupa inteiro com uma bateria só.', when: '19 set 2026' },
    { name: 'Aline T.', rating: 5, title: 'Maleta organizada', body: 'Peças de qualidade e tudo tem seu lugar.', when: '08 set 2026' },
    { name: 'Fábio L.', rating: 4, title: 'Leve e forte', body: 'Boa para quem não é profissional. Carrega rápido.', when: '29 ago 2026' },
  ],
  acessorios: [
    { name: 'Juliana N.', rating: 5, title: 'Salvou a viagem', body: 'Carreguei celular e fone por três dias.', when: '18 set 2026' },
    { name: 'Hugo B.', rating: 4, title: 'Confortável', body: 'Cabe o notebook e ainda sobra espaço. Não molhou na chuva.', when: '10 set 2026' },
    { name: 'Carla W.', rating: 5, title: 'Muito prática', body: 'Acabamento bom e zíperes firmes.', when: '31 ago 2026' },
  ],
}
export function reviewsFor(p: Product) {
  // Retorna o resultado desta função. Em componentes React, normalmente o retorno representa a interface que será renderizada.
  return reviewBank[p.categorySlug] ?? []
}

import { FormData, CalculationResults, ComodoData, ProjetoResults, JanelaInsolacao, ProtecaoType } from '@/types';

// Tabela de Fatores (Constantes)
export const FATORES = {
  JANELAS_INSOLACAO: {
    norte: {
      sem_protecao: 1000,
      protecao_interna: 480,
      protecao_externa: 290
    },
    nordeste: {
      sem_protecao: 1000,
      protecao_interna: 400,
      protecao_externa: 290
    },
    leste: {
      sem_protecao: 1130,
      protecao_interna: 550,
      protecao_externa: 360
    },
    sudeste: {
      sem_protecao: 840,
      protecao_interna: 360,
      protecao_externa: 290
    },
    sudoeste: {
      sem_protecao: 1680,
      protecao_interna: 670,
      protecao_externa: 480
    },
    oeste: {
      sem_protecao: 2100,
      protecao_interna: 920,
      protecao_externa: 630
    },
    noroeste: {
      sem_protecao: 1500,
      protecao_interna: 630,
      protecao_externa: 400
    }
  },
  JANELAS_TRANSMISSAO: {
    vidroComum: 210,
    tijoloVidro: 105
  },
  PAREDES: {
    sul: {
      leve: 55,
      pesada: 42
    },
    outras: {
      leve: 84,
      pesada: 50
    },
    interna: 33
  },
  TETO: {
    laje: 315,
    lajeIsolacao: 125,
    entreAndares: 52,
    telhadoIsolado: 72,
    telhadoSemIsolacao: 160
  },
  PISO: 52,
  PESSOAS: {
    normal: 630,
    fisica: 1000
  },
  ILUMINACAO_APARELHOS: {
    incandescente: 4, // BTU/h por W
    fluorescente: 2, // BTU/h por W
    aparelhos: 860, // BTU/h por KW
    motores: 645, // BTU/h por HP
    computadores: 3.412 // BTU/h por W
  },
  VAOS_ABERTOS: 630
};

// Fatores Climáticos por Estado
export const FATORES_CLIMATICOS: { [key: string]: number } = {
  'AC': 1.00,
  'AM': 1.05,
  'RR': 1.05,
  'RO': 1.00,
  'PA': 1.05,
  'AP': 1.05,
  'TO': 1.00,
  'MA': 1.05,
  'PI': 1.00,
  'CE': 1.00,
  'RN': 1.00,
  'PB': 1.00,
  'PE': 1.00,
  'AL': 1.00,
  'SE': 1.00,
  'BA': 0.95,
  'MT': 1.00,
  'MS': 1.00,
  'GO': 1.00,
  'DF': 1.00,
  'MG': 0.85,
  'ES': 1.00,
  'RJ': 0.85,
  'SP': 0.85,
  'PR': 0.90,
  'SC': 0.90,
  'RS': 0.90
};

export const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

// Função para criar um novo cômodo vazio
export const criarNovoComodo = (id: string, nome: string): ComodoData => {
  return {
    id,
    nome,
    janelasInsolacao: {
      norte: { largura: 0, altura: 0, protecao: 'sem_protecao' },
      nordeste: { largura: 0, altura: 0, protecao: 'sem_protecao' },
      leste: { largura: 0, altura: 0, protecao: 'sem_protecao' },
      sudeste: { largura: 0, altura: 0, protecao: 'sem_protecao' },
      sudoeste: { largura: 0, altura: 0, protecao: 'sem_protecao' },
      oeste: { largura: 0, altura: 0, protecao: 'sem_protecao' },
      noroeste: { largura: 0, altura: 0, protecao: 'sem_protecao' }
    },
    janelasTransmissao: {
      vidroComum: { largura: 0, altura: 0 },
      tijoloVidro: { largura: 0, altura: 0 }
    },
    paredes: {
      tipoConstrucao: 'leve',
      externasSul: { largura: 0, altura: 0 },
      externasOutras: { largura: 0, altura: 0 },
      internas: { largura: 0, altura: 0 }
    },
    teto: {
      lajeComum: { comprimento: 0, largura: 0 },
      lajeIsolacao: { comprimento: 0, largura: 0 },
      entreAndares: { comprimento: 0, largura: 0 },
      telhadoIsolado: { comprimento: 0, largura: 0 },
      telhadoSemIsolacao: { comprimento: 0, largura: 0 }
    },
    piso: { comprimento: 0, largura: 0 },
    pessoas: {
      normal: 0,
      fisica: 0
    },
    iluminacaoAparelhos: {
      lampadasIncandescentes: 0,
      lampadasFluorescentes: 0,
      aparelhosEletricos: 0,
      motores: 0,
      computadores: 0
    },
    vaosAbertos: { largura: 0, altura: 0 }
  };
};

// Função para calcular área
const calcularArea = (largura: number, altura: number): number => {
  return (largura || 0) * (altura || 0);
};

// Função para calcular Carga Tipo I (Janelas - Insolação)
const calcularCargaTipoI = (data: ComodoData): number => {
  const { janelasInsolacao } = data;
  let total = 0;
  
  Object.entries(janelasInsolacao).forEach(([orientacao, janela]) => {
    if (orientacao === 'sul') return; // Sul é omitido (fator zero)
    
    const janelaTyped = janela as JanelaInsolacao;
    const area = calcularArea(janelaTyped.largura, janelaTyped.altura);
    const fatoresOrientacao = FATORES.JANELAS_INSOLACAO[orientacao as keyof typeof FATORES.JANELAS_INSOLACAO];
    const fator = fatoresOrientacao[janelaTyped.protecao as ProtecaoType];
    total += area * fator;
  });
  
  return total;
};

// Função para calcular Carga Tipo II (Janelas - Transmissão)
const calcularCargaTipoII = (data: ComodoData): number => {
  const { janelasTransmissao } = data;
  
  const areaVidroComum = calcularArea(janelasTransmissao.vidroComum.largura, janelasTransmissao.vidroComum.altura);
  const areaTijoloVidro = calcularArea(janelasTransmissao.tijoloVidro.largura, janelasTransmissao.tijoloVidro.altura);
  
  return (areaVidroComum * FATORES.JANELAS_TRANSMISSAO.vidroComum) + 
         (areaTijoloVidro * FATORES.JANELAS_TRANSMISSAO.tijoloVidro);
};

// Função para calcular Carga Tipo III (Paredes)
const calcularCargaTipoIII = (data: ComodoData): number => {
  const { paredes } = data;
  
  const areaSul = calcularArea(paredes.externasSul.largura, paredes.externasSul.altura);
  const areaOutras = calcularArea(paredes.externasOutras.largura, paredes.externasOutras.altura);
  const areaInterna = calcularArea(paredes.internas.largura, paredes.internas.altura);
  
  const fatorSul = FATORES.PAREDES.sul[paredes.tipoConstrucao as keyof typeof FATORES.PAREDES.sul];
  const fatorOutras = FATORES.PAREDES.outras[paredes.tipoConstrucao as keyof typeof FATORES.PAREDES.outras];
  
  return (areaSul * fatorSul) + (areaOutras * fatorOutras) + (areaInterna * FATORES.PAREDES.interna);
};

// Função para calcular Carga Tipo IV (Teto)
const calcularCargaTipoIV = (data: ComodoData): number => {
  const { teto } = data;
  let total = 0;
  
  total += calcularArea(teto.lajeComum.comprimento, teto.lajeComum.largura) * FATORES.TETO.laje;
  total += calcularArea(teto.lajeIsolacao.comprimento, teto.lajeIsolacao.largura) * FATORES.TETO.lajeIsolacao;
  total += calcularArea(teto.entreAndares.comprimento, teto.entreAndares.largura) * FATORES.TETO.entreAndares;
  total += calcularArea(teto.telhadoIsolado.comprimento, teto.telhadoIsolado.largura) * FATORES.TETO.telhadoIsolado;
  total += calcularArea(teto.telhadoSemIsolacao.comprimento, teto.telhadoSemIsolacao.largura) * FATORES.TETO.telhadoSemIsolacao;
  
  return total;
};

// Função para calcular Carga Tipo V (Piso)
const calcularCargaTipoV = (data: ComodoData): number => {
  const area = calcularArea(data.piso.comprimento, data.piso.largura);
  return area * FATORES.PISO;
};

// Função para calcular Carga Tipo VI (Pessoas)
const calcularCargaTipoVI = (data: ComodoData): number => {
  const { pessoas } = data;
  return ((pessoas.normal || 0) * FATORES.PESSOAS.normal) + 
         ((pessoas.fisica || 0) * FATORES.PESSOAS.fisica);
};

// Função para calcular Carga Tipo VII (Iluminação e Aparelhos)
const calcularCargaTipoVII = (data: ComodoData): number => {
  const { iluminacaoAparelhos } = data;
  
  return ((iluminacaoAparelhos.lampadasIncandescentes || 0) * FATORES.ILUMINACAO_APARELHOS.incandescente) +
         ((iluminacaoAparelhos.lampadasFluorescentes || 0) * FATORES.ILUMINACAO_APARELHOS.fluorescente) +
         ((iluminacaoAparelhos.aparelhosEletricos || 0) * FATORES.ILUMINACAO_APARELHOS.aparelhos) +
         ((iluminacaoAparelhos.motores || 0) * FATORES.ILUMINACAO_APARELHOS.motores) +
         ((iluminacaoAparelhos.computadores || 0) * FATORES.ILUMINACAO_APARELHOS.computadores);
};

// Função para calcular Carga Tipo VIII (Vãos Abertos)
const calcularCargaTipoVIII = (data: ComodoData): number => {
  const area = calcularArea(data.vaosAbertos.largura, data.vaosAbertos.altura);
  return area * FATORES.VAOS_ABERTOS;
};

// Função para calcular um cômodo individual
export const calcularCargaTermicaComodo = (comodo: ComodoData, fatorClimatico: number): CalculationResults => {
  const cargaTipoI = calcularCargaTipoI(comodo);
  const cargaTipoII = calcularCargaTipoII(comodo);
  const cargaTipoIII = calcularCargaTipoIII(comodo);
  const cargaTipoIV = calcularCargaTipoIV(comodo);
  const cargaTipoV = calcularCargaTipoV(comodo);
  const cargaTipoVI = calcularCargaTipoVI(comodo);
  const cargaTipoVII = calcularCargaTipoVII(comodo);
  const cargaTipoVIII = calcularCargaTipoVIII(comodo);
  
  const subtotalBTU = cargaTipoI + cargaTipoII + cargaTipoIII + cargaTipoIV + 
                      cargaTipoV + cargaTipoVI + cargaTipoVII + cargaTipoVIII;
  
  const totalBTU = subtotalBTU * fatorClimatico;
  const totalTR = totalBTU / 12000;
  const totalKcal = totalBTU * 0.252;
  
  return {
    cargaTipoI,
    cargaTipoII,
    cargaTipoIII,
    cargaTipoIV,
    cargaTipoV,
    cargaTipoVI,
    cargaTipoVII,
    cargaTipoVIII,
    subtotalBTU,
    totalBTU,
    totalTR,
    totalKcal
  };
};

// Função principal de cálculo para todo o projeto
export const calcularCargaTermica = (data: FormData): ProjetoResults => {
  // Usar o fator climático do estado selecionado ou o valor manual
  const fatorClimatico = data.projectInfo.estado ? 
    FATORES_CLIMATICOS[data.projectInfo.estado] || data.fatorClimatico : 
    data.fatorClimatico || 1.0;

  const comodos: { [key: string]: CalculationResults } = {};
  const totais: CalculationResults = {
    cargaTipoI: 0,
    cargaTipoII: 0,
    cargaTipoIII: 0,
    cargaTipoIV: 0,
    cargaTipoV: 0,
    cargaTipoVI: 0,
    cargaTipoVII: 0,
    cargaTipoVIII: 0,
    subtotalBTU: 0,
    totalBTU: 0,
    totalTR: 0,
    totalKcal: 0
  };

  // Calcular cada cômodo - verificar se existe o array de cômodos
  if (data.comodos && Array.isArray(data.comodos)) {
    data.comodos.forEach(comodo => {
      const resultado = calcularCargaTermicaComodo(comodo, fatorClimatico);
      comodos[comodo.id] = resultado;
      
      // Somar aos totais
      totais.cargaTipoI += resultado.cargaTipoI;
      totais.cargaTipoII += resultado.cargaTipoII;
      totais.cargaTipoIII += resultado.cargaTipoIII;
      totais.cargaTipoIV += resultado.cargaTipoIV;
      totais.cargaTipoV += resultado.cargaTipoV;
      totais.cargaTipoVI += resultado.cargaTipoVI;
      totais.cargaTipoVII += resultado.cargaTipoVII;
      totais.cargaTipoVIII += resultado.cargaTipoVIII;
      totais.subtotalBTU += resultado.subtotalBTU;
      totais.totalBTU += resultado.totalBTU;
      totais.totalTR += resultado.totalTR;
      totais.totalKcal += resultado.totalKcal;
    });
  }

  return { comodos, totais };
};

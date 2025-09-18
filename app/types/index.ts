export interface ProjectInfo {
  cliente: string;
  local: string;
  estado: string;
}

export type ProtecaoType = 'sem_protecao' | 'protecao_interna' | 'protecao_externa';
export type ConstrucaoType = 'leve' | 'pesada';

export interface JanelaInsolacao {
  largura: number;
  altura: number;
  protecao: ProtecaoType;
}

export interface JanelaTransmissao {
  largura: number;
  altura: number;
}

export interface Parede {
  largura: number;
  altura: number;
}

export interface Teto {
  comprimento: number;
  largura: number;
}

export interface ComodoData {
  id: string;
  nome: string;
  
  // Tipo I - Janelas (Insolação)
  janelasInsolacao: {
    norte: JanelaInsolacao;
    nordeste: JanelaInsolacao;
    leste: JanelaInsolacao;
    sudeste: JanelaInsolacao;
    sudoeste: JanelaInsolacao;
    oeste: JanelaInsolacao;
    noroeste: JanelaInsolacao;
  };
  
  // Tipo II - Janelas (Transmissão)
  janelasTransmissao: {
    vidroComum: JanelaTransmissao;
    tijoloVidro: JanelaTransmissao;
  };
  
  // Tipo III - Paredes
  paredes: {
    tipoConstrucao: ConstrucaoType;
    externasSul: Parede;
    externasOutras: Parede;
    internas: Parede;
  };
  
  // Tipo IV - Teto
  teto: {
    lajeComum: Teto;
    lajeIsolacao: Teto;
    entreAndares: Teto;
    telhadoIsolado: Teto;
    telhadoSemIsolacao: Teto;
  };
  
  // Tipo V - Piso
  piso: Teto;
  
  // Tipo VI - Pessoas
  pessoas: {
    normal: number;
    fisica: number;
  };
  
  // Tipo VII - Iluminação e Aparelhos
  iluminacaoAparelhos: {
    lampadasIncandescentes: number; // W
    lampadasFluorescentes: number; // W
    aparelhosEletricos: number; // KW
    motores: number; // HP
    computadores: number; // W
  };
  
  // Tipo VIII - Portas ou Vãos
  vaosAbertos: JanelaTransmissao;
}

export interface FormData {
  projectInfo: ProjectInfo;
  comodos: ComodoData[];
  fatorClimatico: number;
}

export interface CalculationResults {
  cargaTipoI: number;
  cargaTipoII: number;
  cargaTipoIII: number;
  cargaTipoIV: number;
  cargaTipoV: number;
  cargaTipoVI: number;
  cargaTipoVII: number;
  cargaTipoVIII: number;
  subtotalBTU: number;
  totalBTU: number;
  totalTR: number;
  totalKcal: number;
}

export interface ProjetoResults {
  comodos: { [key: string]: CalculationResults };
  totais: CalculationResults;
}

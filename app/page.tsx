'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { FormData, ProtecaoType, ConstrucaoType } from './types';
import { calcularCargaTermica, ESTADOS_BRASIL, FATORES_CLIMATICOS, criarNovoComodo } from './utils/calculations';

const initialFormData: FormData = {
  projectInfo: {
    cliente: '',
    local: '',
    estado: ''
  },
  comodos: [criarNovoComodo('comodo-1', 'Sala')],
  fatorClimatico: 1.0
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<string>('comodo-1');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const results = useMemo(() => calcularCargaTermica(formData), [formData]);

  const updateProjectInfo = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      projectInfo: { ...prev.projectInfo, [field]: value }
    }));
  }, []);

  const updateComodoData = useCallback((comodoId: string, path: string, value: any) => {
    setFormData(prev => {
      const newComodos = prev.comodos.map(comodo => {
        if (comodo.id !== comodoId) return comodo;
        
        const pathArray = path.split('.');
        const newComodo = { ...comodo };
        let current: any = newComodo;
        
        for (let i = 0; i < pathArray.length - 1; i++) {
          current[pathArray[i]] = { ...current[pathArray[i]] };
          current = current[pathArray[i]];
        }
        
        current[pathArray[pathArray.length - 1]] = value;
        return newComodo;
      });
      
      return { ...prev, comodos: newComodos };
    });
  }, []);

  const updateComodoName = useCallback((comodoId: string, newName: string) => {
    setFormData(prev => ({
      ...prev,
      comodos: prev.comodos.map(comodo => 
        comodo.id === comodoId ? { ...comodo, nome: newName } : comodo
      )
    }));
  }, []);

  const adicionarComodo = useCallback(() => {
    const novoId = `comodo-${Date.now()}`;
    const novoComodo = criarNovoComodo(novoId, `Cômodo ${formData.comodos.length + 1}`);
    
    setFormData(prev => ({
      ...prev,
      comodos: [...prev.comodos, novoComodo]
    }));
    
    setActiveTab(novoId);
  }, [formData.comodos.length]);

  const removerComodo = useCallback((comodoId: string) => {
    if (formData.comodos.length <= 1) return; // Não permitir remover o último cômodo
    
    setFormData(prev => ({
      ...prev,
      comodos: prev.comodos.filter(comodo => comodo.id !== comodoId)
    }));
    
    // Se o cômodo ativo foi removido, trocar para o primeiro disponível
    if (activeTab === comodoId) {
      const remainingComodos = formData.comodos.filter(c => c.id !== comodoId);
      setActiveTab(remainingComodos[0]?.id || '');
    }
  }, [formData.comodos, activeTab]);

  const clearForm = useCallback(() => {
    setFormData(initialFormData);
    setActiveTab('comodo-1');
  }, []);

  const printReport = useCallback(() => {
    window.print();
  }, []);

  const showReportPreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const activeComodo = formData.comodos.find(c => c.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 no-print">
          SaaS - Cálculo de Carga Térmica
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Formulário de Entrada */}
          <div className="xl:col-span-3 space-y-6 no-print">
            {/* Informações do Projeto */}
            <div className="bg-white p-6 rounded-lg shadow-md form-section">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Informações do Projeto</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.projectInfo.cliente}
                    onChange={(e) => updateProjectInfo('cliente', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.projectInfo.local}
                    onChange={(e) => updateProjectInfo('local', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado (Fator Climático)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.projectInfo.estado}
                    onChange={(e) => {
                      updateProjectInfo('estado', e.target.value);
                      if (e.target.value) {
                        setFormData(prev => ({
                          ...prev,
                          fatorClimatico: FATORES_CLIMATICOS[e.target.value] || 1.0
                        }));
                      }
                    }}
                  >
                    <option value="">Selecione o Estado</option>
                    {ESTADOS_BRASIL.map(estado => (
                      <option key={estado.sigla} value={estado.sigla}>
                        {estado.nome} ({estado.sigla}) - Fator: {FATORES_CLIMATICOS[estado.sigla]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Abas dos Cômodos */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.comodos.map((comodo) => (
                      <div key={comodo.id} className="flex items-center">
                        <button
                          onClick={() => setActiveTab(comodo.id)}
                          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                            activeTab === comodo.id
                              ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {comodo.nome}
                        </button>
                        {formData.comodos.length > 1 && (
                          <button
                            onClick={() => removerComodo(comodo.id)}
                            className="ml-1 px-2 py-1 text-red-600 hover:bg-red-100 rounded"
                            title="Remover cômodo"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={adicionarComodo}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    + Adicionar Cômodo
                  </button>
                </div>
              </div>

              {/* Conteúdo do Cômodo Ativo */}
              {activeComodo && (
                <div className="p-6 space-y-6">
                  {/* Nome do Cômodo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Cômodo
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={activeComodo.nome}
                      onChange={(e) => updateComodoName(activeComodo.id, e.target.value)}
                    />
                  </div>

                  {/* Tipo I - Janelas com Insolação */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo I - Janelas com Insolação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(activeComodo.janelasInsolacao).map(([orientacao, values]) => (
                        <div key={orientacao} className="border p-3 rounded-md">
                          <h4 className="font-medium capitalize mb-2">{orientacao.replace('_', ' ')}</h4>
                          <div className="space-y-2">
                            <input
                              type="number"
                              placeholder="Largura (m)"
                              className="w-full px-2 py-1 border rounded text-sm"
                              value={values.largura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, `janelasInsolacao.${orientacao}.largura`, Number(e.target.value) || 0)}
                            />
                            <input
                              type="number"
                              placeholder="Altura (m)"
                              className="w-full px-2 py-1 border rounded text-sm"
                              value={values.altura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, `janelasInsolacao.${orientacao}.altura`, Number(e.target.value) || 0)}
                            />
                            <select
                              className="w-full px-2 py-1 border rounded text-sm"
                              value={values.protecao}
                              onChange={(e) => updateComodoData(activeComodo.id, `janelasInsolacao.${orientacao}.protecao`, e.target.value as ProtecaoType)}
                            >
                              <option value="sem_protecao">Sem Proteção</option>
                              <option value="protecao_interna">Proteção Interna</option>
                              <option value="protecao_externa">Proteção Externa</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tipo II - Janelas por Transmissão */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo II - Janelas por Transmissão</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium mb-2">Vidro Comum</h4>
                        <div className="space-y-2">
                          <input
                            type="number"
                            placeholder="Largura (m)"
                            className="w-full px-2 py-1 border rounded"
                            value={activeComodo.janelasTransmissao.vidroComum.largura || ''}
                            onChange={(e) => updateComodoData(activeComodo.id, 'janelasTransmissao.vidroComum.largura', Number(e.target.value) || 0)}
                          />
                          <input
                            type="number"
                            placeholder="Altura (m)"
                            className="w-full px-2 py-1 border rounded"
                            value={activeComodo.janelasTransmissao.vidroComum.altura || ''}
                            onChange={(e) => updateComodoData(activeComodo.id, 'janelasTransmissao.vidroComum.altura', Number(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="border p-3 rounded-md">
                        <h4 className="font-medium mb-2">Tijolo de Vidro</h4>
                        <div className="space-y-2">
                          <input
                            type="number"
                            placeholder="Largura (m)"
                            className="w-full px-2 py-1 border rounded"
                            value={activeComodo.janelasTransmissao.tijoloVidro.largura || ''}
                            onChange={(e) => updateComodoData(activeComodo.id, 'janelasTransmissao.tijoloVidro.largura', Number(e.target.value) || 0)}
                          />
                          <input
                            type="number"
                            placeholder="Altura (m)"
                            className="w-full px-2 py-1 border rounded"
                            value={activeComodo.janelasTransmissao.tijoloVidro.altura || ''}
                            onChange={(e) => updateComodoData(activeComodo.id, 'janelasTransmissao.tijoloVidro.altura', Number(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tipo III - Paredes */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo III - Paredes</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Construção
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.paredes.tipoConstrucao}
                          onChange={(e) => updateComodoData(activeComodo.id, 'paredes.tipoConstrucao', e.target.value as ConstrucaoType)}
                        >
                          <option value="leve">Leve</option>
                          <option value="pesada">Pesada</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border p-3 rounded-md">
                          <h4 className="font-medium mb-2">Externas Sul</h4>
                          <div className="space-y-2">
                            <input
                              type="number"
                              placeholder="Largura (m)"
                              className="w-full px-2 py-1 border rounded"
                              value={activeComodo.paredes.externasSul.largura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, 'paredes.externasSul.largura', Number(e.target.value) || 0)}
                            />
                            <input
                              type="number"
                              placeholder="Altura (m)"
                              className="w-full px-2 py-1 border rounded"
                              value={activeComodo.paredes.externasSul.altura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, 'paredes.externasSul.altura', Number(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="border p-3 rounded-md">
                          <h4 className="font-medium mb-2">Externas Outras</h4>
                          <div className="space-y-2">
                            <input
                              type="number"
                              placeholder="Largura (m)"
                              className="w-full px-2 py-1 border rounded"
                              value={activeComodo.paredes.externasOutras.largura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, 'paredes.externasOutras.largura', Number(e.target.value) || 0)}
                            />
                            <input
                              type="number"
                              placeholder="Altura (m)"
                              className="w-full px-2 py-1 border rounded"
                              value={activeComodo.paredes.externasOutras.altura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, 'paredes.externasOutras.altura', Number(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="border p-3 rounded-md">
                          <h4 className="font-medium mb-2">Internas</h4>
                          <div className="space-y-2">
                            <input
                              type="number"
                              placeholder="Largura (m)"
                              className="w-full px-2 py-1 border rounded"
                              value={activeComodo.paredes.internas.largura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, 'paredes.internas.largura', Number(e.target.value) || 0)}
                            />
                            <input
                              type="number"
                              placeholder="Altura (m)"
                              className="w-full px-2 py-1 border rounded"
                              value={activeComodo.paredes.internas.altura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, 'paredes.internas.altura', Number(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tipo IV - Teto */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo IV - Teto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(activeComodo.teto).map(([tipo, values]) => (
                        <div key={tipo} className="border p-3 rounded-md">
                          <h4 className="font-medium mb-2 capitalize">
                            {tipo.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <div className="space-y-2">
                            <input
                              type="number"
                              placeholder="Comprimento (m)"
                              className="w-full px-2 py-1 border rounded text-sm"
                              value={values.comprimento || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, `teto.${tipo}.comprimento`, Number(e.target.value) || 0)}
                            />
                            <input
                              type="number"
                              placeholder="Largura (m)"
                              className="w-full px-2 py-1 border rounded text-sm"
                              value={values.largura || ''}
                              onChange={(e) => updateComodoData(activeComodo.id, `teto.${tipo}.largura`, Number(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tipo V - Piso */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo V - Piso</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comprimento (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.piso.comprimento || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'piso.comprimento', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Largura (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.piso.largura || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'piso.largura', Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tipo VI - Pessoas */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo VI - Pessoas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Atividade Normal
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.pessoas.normal || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'pessoas.normal', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Atividade Física
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.pessoas.fisica || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'pessoas.fisica', Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tipo VII - Iluminação e Aparelhos */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo VII - Iluminação e Aparelhos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lâmpadas Incandescentes (W)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.iluminacaoAparelhos.lampadasIncandescentes || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'iluminacaoAparelhos.lampadasIncandescentes', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lâmpadas Fluorescentes (W)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.iluminacaoAparelhos.lampadasFluorescentes || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'iluminacaoAparelhos.lampadasFluorescentes', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aparelhos Elétricos (W)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.iluminacaoAparelhos.aparelhosEletricos || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'iluminacaoAparelhos.aparelhosEletricos', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Motores (W)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.iluminacaoAparelhos.motores || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'iluminacaoAparelhos.motores', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Computadores (W)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.iluminacaoAparelhos.computadores || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'iluminacaoAparelhos.computadores', Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tipo VIII - Portas ou Vãos Abertos */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Tipo VIII - Portas ou Vãos Abertos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Largura (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.vaosAbertos.largura || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'vaosAbertos.largura', Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Altura (m)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={activeComodo.vaosAbertos.altura || ''}
                          onChange={(e) => updateComodoData(activeComodo.id, 'vaosAbertos.altura', Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fator Climático */}
            <div className="bg-white p-6 rounded-lg shadow-md form-section">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">Fator Climático</h2>
              <div className="space-y-3">
                {formData.projectInfo.estado && (
                  <div className="p-3 bg-green-50 rounded-md border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Fator automático do estado selecionado:</strong> {FATORES_CLIMATICOS[formData.projectInfo.estado]}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fator Climático {!formData.projectInfo.estado && '(0.8 - 1.2)'}
                    {formData.projectInfo.estado && '(Manual - sobrescreve o automático)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.8"
                    max="1.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.fatorClimatico || ''}
                    placeholder={formData.projectInfo.estado ? `Automático: ${FATORES_CLIMATICOS[formData.projectInfo.estado]}` : '1.0'}
                    onChange={(e) => setFormData(prev => ({ ...prev, fatorClimatico: Number(e.target.value) || 1.0 }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.projectInfo.estado ? 
                      'Deixe vazio para usar o fator automático do estado, ou digite um valor para sobrescrever' : 
                      'Digite um valor entre 0.8 e 1.2, ou selecione um estado para usar o fator automático'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="bg-white p-6 rounded-lg shadow-md form-section">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={clearForm}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  Limpar Formulário
                </button>
                <button
                  onClick={showReportPreview}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Visualizar Relatório
                </button>
                <button
                  onClick={printReport}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Imprimir Relatório
                </button>
              </div>
            </div>
          </div>

          {/* Seção de Resultados */}
          <div className="xl:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8 result-card">
              <h2 className="text-xl font-semibold mb-6 text-green-600">Resultados</h2>
              
              {/* Resultado do Cômodo Ativo */}
              {activeComodo && results.comodos[activeComodo.id] && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-3">{activeComodo.nome}</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries({
                      'Janelas (Insolação)': results.comodos[activeComodo.id].cargaTipoI,
                      'Janelas (Transmissão)': results.comodos[activeComodo.id].cargaTipoII,
                      'Paredes': results.comodos[activeComodo.id].cargaTipoIII,
                      'Teto': results.comodos[activeComodo.id].cargaTipoIV,
                      'Piso': results.comodos[activeComodo.id].cargaTipoV,
                      'Pessoas': results.comodos[activeComodo.id].cargaTipoVI,
                      'Iluminação e Aparelhos': results.comodos[activeComodo.id].cargaTipoVII,
                      'Portas ou Vãos': results.comodos[activeComodo.id].cargaTipoVIII
                    }).map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span>{label}:</span>
                        <span className="font-mono">{formatNumber(value)} BTU/h</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="font-mono text-blue-800">{formatNumber(results.comodos[activeComodo.id].totalBTU)} BTU/h</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Todos os Cômodos */}
              <div className="space-y-3 mb-6 print-section">
                <h3 className="font-medium text-gray-800 border-b pb-2">Todos os Cômodos</h3>
                {formData.comodos.map(comodo => (
                  <div key={comodo.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{comodo.nome}:</span>
                      <span className="font-mono">
                        {results.comodos[comodo.id] ? formatNumber(results.comodos[comodo.id].totalBTU) : '0,00'} BTU/h
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 print-results">
                <h3 className="font-medium text-gray-800 border-b pb-2 mb-4">Resultados Finais do Projeto</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-green-800">
                      Carga Térmica Total (BTU/h)
                    </div>
                    <div className="text-2xl font-bold text-green-900 font-mono">
                      {formatNumber(results.totais.totalBTU)}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-blue-800">
                      Carga Térmica Total (TR)
                    </div>
                    <div className="text-2xl font-bold text-blue-900 font-mono">
                      {formatNumber(results.totais.totalTR)}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-lg font-semibold text-orange-800">
                      Carga Térmica Total (Kcal/h)
                    </div>
                    <div className="text-2xl font-bold text-orange-900 font-mono">
                      {formatNumber(results.totais.totalKcal)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Preview do Relatório */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 print:bg-transparent print:inset-auto print:static print:block print:m-0 print:p-0">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl max-h-full overflow-auto m-4 print:max-w-none print:m-0 print:shadow-none print:rounded-none">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center no-print">
              <h2 className="text-xl font-bold text-gray-800">Relatório de Carga Térmica</h2>
              <div className="flex gap-2">
                <button
                  onClick={printReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                >
                  🖨️ Imprimir
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                >
                  ✕ Fechar
                </button>
              </div>
            </div>
            
            <div className="p-8 print:p-0">
              {/* Cabeçalho do Relatório */}
              <div className="text-center mb-8 avoid-break">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">RELATÓRIO DE CARGA TÉRMICA</h1>
                <div className="text-lg text-gray-600 space-y-1">
                  {formData.projectInfo.cliente && <p><strong>Cliente:</strong> {formData.projectInfo.cliente}</p>}
                  {formData.projectInfo.local && <p><strong>Local:</strong> {formData.projectInfo.local}</p>}
                  {formData.projectInfo.estado && <p><strong>Estado:</strong> {formData.projectInfo.estado} (Fator: {formData.fatorClimatico})</p>}
                  <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                <hr className="mt-4 border-gray-300"/>
              </div>

              {/* Detalhes por Cômodo */}
              <div className="space-y-8">
                {formData.comodos.map((comodo, index) => {
                  const resultado = results.comodos[comodo.id];
                  if (!resultado) return null;

                  return (
                    <div key={comodo.id} className="avoid-break">
                      {index > 0 && <div className="page-break"></div>}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center border-b-2 border-blue-200 pb-2">
                          {comodo.nome}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {/* Dados de Entrada */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-1">Dados de Entrada</h3>
                            <div className="space-y-2 text-sm">
                              {/* Janelas Insolação */}
                              <div>
                                <strong className="text-gray-800">Janelas com Insolação:</strong>
                                {Object.entries(comodo.janelasInsolacao).map(([orient, vals]) => {
                                  if (vals.largura > 0 || vals.altura > 0) {
                                    return (
                                      <div key={orient} className="ml-4 text-gray-700">
                                        {orient.replace('_', ' ')}: {vals.largura}m × {vals.altura}m ({vals.protecao})
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>

                              {/* Janelas Transmissão */}
                              {(comodo.janelasTransmissao.vidroComum.largura > 0 || comodo.janelasTransmissao.tijoloVidro.largura > 0) && (
                                <div>
                                  <strong className="text-gray-800">Janelas por Transmissão:</strong>
                                  {comodo.janelasTransmissao.vidroComum.largura > 0 && (
                                    <div className="ml-4 text-gray-700">
                                      Vidro Comum: {comodo.janelasTransmissao.vidroComum.largura}m × {comodo.janelasTransmissao.vidroComum.altura}m
                                    </div>
                                  )}
                                  {comodo.janelasTransmissao.tijoloVidro.largura > 0 && (
                                    <div className="ml-4 text-gray-700">
                                      Tijolo Vidro: {comodo.janelasTransmissao.tijoloVidro.largura}m × {comodo.janelasTransmissao.tijoloVidro.altura}m
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Paredes */}
                              <div>
                                <strong className="text-gray-800">Paredes ({comodo.paredes.tipoConstrucao}):</strong>
                                {comodo.paredes.externasSul.largura > 0 && (
                                  <div className="ml-4 text-gray-700">Ext. Sul: {comodo.paredes.externasSul.largura}m × {comodo.paredes.externasSul.altura}m</div>
                                )}
                                {comodo.paredes.externasOutras.largura > 0 && (
                                  <div className="ml-4 text-gray-700">Ext. Outras: {comodo.paredes.externasOutras.largura}m × {comodo.paredes.externasOutras.altura}m</div>
                                )}
                                {comodo.paredes.internas.largura > 0 && (
                                  <div className="ml-4 text-gray-700">Internas: {comodo.paredes.internas.largura}m × {comodo.paredes.internas.altura}m</div>
                                )}
                              </div>

                              {/* Pessoas */}
                              {(comodo.pessoas.normal > 0 || comodo.pessoas.fisica > 0) && (
                                <div>
                                  <strong className="text-gray-800">Pessoas:</strong>
                                  {comodo.pessoas.normal > 0 && <span className="ml-4 text-gray-700">Normal: {comodo.pessoas.normal}</span>}
                                  {comodo.pessoas.fisica > 0 && <span className="ml-4 text-gray-700">Ativ. Física: {comodo.pessoas.fisica}</span>}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Resultados */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-1">Cargas Calculadas</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-700">Janelas (Insolação):</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoI)} BTU/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Janelas (Transmissão):</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoII)} BTU/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Paredes:</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoIII)} BTU/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Teto:</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoIV)} BTU/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Piso:</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoV)} BTU/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Pessoas:</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoVI)} BTU/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Iluminação/Aparelhos:</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoVII)} BTU/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Portas/Vãos:</span>
                                <span className="font-mono font-semibold text-gray-800">{formatNumber(resultado.cargaTipoVIII)} BTU/h</span>
                              </div>
                              <hr className="border-gray-400"/>
                              <div className="flex justify-between font-bold text-lg">
                                <span className="text-blue-800">TOTAL:</span>
                                <span className="font-mono text-blue-900">{formatNumber(resultado.totalBTU)} BTU/h</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumo Final */}
              <div className="mt-12 avoid-break">
                <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200">
                  <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">RESUMO FINAL DO PROJETO</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-lg font-semibold text-green-700 mb-2">Carga Total</div>
                      <div className="text-3xl font-bold text-green-800 font-mono">{formatNumber(results.totais.totalBTU)}</div>
                      <div className="text-sm text-green-600">BTU/h</div>
                    </div>
                    
                    <div className="text-center bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-lg font-semibold text-blue-700 mb-2">Toneladas de Refrigeração</div>
                      <div className="text-3xl font-bold text-blue-800 font-mono">{formatNumber(results.totais.totalTR)}</div>
                      <div className="text-sm text-blue-600">TR</div>
                    </div>
                    
                    <div className="text-center bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-lg font-semibold text-orange-700 mb-2">Quilocalorias</div>
                      <div className="text-3xl font-bold text-orange-800 font-mono">{formatNumber(results.totais.totalKcal)}</div>
                      <div className="text-sm text-orange-600">Kcal/h</div>
                    </div>
                  </div>

                  <div className="mt-6 text-center text-gray-600 text-sm">
                    <p>Fator Climático Aplicado: {formData.fatorClimatico}</p>
                    <p>Relatório gerado em {new Date().toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

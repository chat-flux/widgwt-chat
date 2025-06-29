-- Insert sample agents
INSERT INTO agents (id, user_id, name, description, system_prompt, model, temperature, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'user_1', 'Assistente Jurídico', 'Especialista em análise de contratos e documentos legais', 'Você é um assistente jurídico especializado em análise de contratos. Analise documentos com precisão e forneça insights legais relevantes.', 'gpt-4', 0.3, 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'user_1', 'Consultor Financeiro', 'Especialista em análise financeira e investimentos', 'Você é um consultor financeiro experiente. Forneça análises financeiras detalhadas e recomendações de investimento baseadas em dados.', 'gpt-4', 0.5, 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'user_2', 'Assistente de Marketing', 'Especialista em estratégias de marketing digital', 'Você é um especialista em marketing digital. Crie estratégias eficazes e analise campanhas de marketing.', 'gpt-4', 0.7, 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'user_2', 'Suporte Técnico', 'Assistente para resolução de problemas técnicos', 'Você é um especialista em suporte técnico. Ajude a resolver problemas técnicos de forma clara e eficiente.', 'gpt-3.5-turbo', 0.4, 'active');

-- Insert sample conversations
INSERT INTO conversations (id, agent_id, title, status) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Análise de Contrato de Prestação de Serviços', 'active'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Revisão de Cláusulas Contratuais', 'completed'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Análise de Investimento em Ações', 'active'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Estratégia de Marketing Digital', 'active');

-- Insert sample messages
INSERT INTO messages (conversation_id, role, content) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'user', 'Preciso analisar este contrato de prestação de serviços. Pode me ajudar?'),
('660e8400-e29b-41d4-a716-446655440000', 'assistant', 'Claro! Vou analisar o contrato para você. Por favor, envie o documento e eu farei uma análise detalhada das cláusulas principais.'),
('660e8400-e29b-41d4-a716-446655440001', 'user', 'Quais são os pontos de atenção neste contrato?'),
('660e8400-e29b-41d4-a716-446655440001', 'assistant', 'Identifiquei alguns pontos importantes: 1) Cláusula de rescisão muito restritiva, 2) Penalidades desproporcionais, 3) Falta de definição clara de escopo.'),
('660e8400-e29b-41d4-a716-446655440002', 'user', 'Qual sua opinião sobre investir em ações de tecnologia agora?'),
('660e8400-e29b-41d4-a716-446655440002', 'assistant', 'O setor de tecnologia apresenta boas oportunidades, mas é importante diversificar. Recomendo analisar empresas com fundamentos sólidos e crescimento sustentável.');

-- Insert sample documents
INSERT INTO documents (agent_id, name, filename, original_name, content, type, size, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Contrato Modelo', 'contrato-modelo.pdf', 'Contrato de Prestação de Serviços.pdf', 'Conteúdo do contrato modelo...', 'application/pdf', 245760, 'active'),
('550e8400-e29b-41d4-a716-446655440000', 'Cláusulas Padrão', 'clausulas-padrao.docx', 'Cláusulas Padrão.docx', 'Documento com cláusulas padrão...', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 128000, 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Relatório Financeiro Q4', 'relatorio-q4.xlsx', 'Relatório Q4 2023.xlsx', 'Dados financeiros do quarto trimestre...', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 512000, 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Estratégias de Marketing', 'estrategias-marketing.pdf', 'Estratégias 2024.pdf', 'Documento com estratégias de marketing...', 'application/pdf', 189440, 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'Manual Técnico', 'manual-tecnico.pdf', 'Manual do Sistema.pdf', 'Manual técnico do sistema...', 'application/pdf', 1024000, 'active');

-- Insert sample functions
INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'analisar_clausula', 'Analisa uma cláusula contratual específica', '{"type": "object", "properties": {"clausula": {"type": "string", "description": "Texto da cláusula a ser analisada"}}}', 'function analisarClausula(clausula) {
  const palavrasChave = ["rescisão", "penalidade", "prazo", "pagamento"];
  const analise = {
    risco: "baixo",
    recomendacoes: []
  };
  
  palavrasChave.forEach(palavra => {
    if (clausula.toLowerCase().includes(palavra)) {
      analise.risco = "médio";
      analise.recomendacoes.push(`Revisar termos relacionados a ${palavra}`);
    }
  });
  
  return analise;
}', 'active'),

('550e8400-e29b-41d4-a716-446655440001', 'calcular_roi', 'Calcula o ROI de um investimento', '{"type": "object", "properties": {"investimento_inicial": {"type": "number"}, "retorno": {"type": "number"}, "periodo": {"type": "number"}}}', 'function calcularROI(investimentoInicial, retorno, periodo) {
  const roi = ((retorno - investimentoInicial) / investimentoInicial) * 100;
  const roiAnual = roi / periodo;
  
  return {
    roi_total: roi.toFixed(2),
    roi_anual: roiAnual.toFixed(2),
    classificacao: roi > 15 ? "Excelente" : roi > 8 ? "Bom" : "Regular"
  };
}', 'active'),

('550e8400-e29b-41d4-a716-446655440001', 'calcular_desconto', 'Calcula desconto baseado no tipo de cliente', '{"type": "object", "properties": {"valor": {"type": "number"}, "tipo_cliente": {"type": "string"}}}', 'function calcularDesconto(valor, tipoCliente) {
  const descontos = {
    "premium": 0.15,
    "gold": 0.10,
    "silver": 0.05,
    "bronze": 0.02
  };
  
  return valor * (descontos[tipoCliente] || 0);
}', 'active'),

('550e8400-e29b-41d4-a716-446655440002', 'analisar_campanha', 'Analisa performance de campanha de marketing', '{"type": "object", "properties": {"impressoes": {"type": "number"}, "cliques": {"type": "number"}, "conversoes": {"type": "number"}, "custo": {"type": "number"}}}', 'function analisarCampanha(impressoes, cliques, conversoes, custo) {
  const ctr = (cliques / impressoes) * 100;
  const cpc = custo / cliques;
  const cpa = custo / conversoes;
  const conversionRate = (conversoes / cliques) * 100;
  
  return {
    ctr: ctr.toFixed(2),
    cpc: cpc.toFixed(2),
    cpa: cpa.toFixed(2),
    conversion_rate: conversionRate.toFixed(2),
    performance: ctr > 2 ? "Boa" : "Precisa melhorar"
  };
}', 'active'),

('550e8400-e29b-41d4-a716-446655440003', 'diagnosticar_problema', 'Diagnostica problemas técnicos comuns', '{"type": "object", "properties": {"sintoma": {"type": "string"}, "sistema": {"type": "string"}}}', 'function diagnosticarProblema(sintoma, sistema) {
  const diagnosticos = {
    "lento": "Verificar memória RAM e processos em execução",
    "erro": "Verificar logs do sistema e dependências",
    "travamento": "Verificar temperatura e drivers",
    "conexao": "Verificar configurações de rede"
  };
  
  const solucao = diagnosticos[sintoma.toLowerCase()] || "Executar diagnóstico completo";
  
  return {
    problema_identificado: sintoma,
    sistema_afetado: sistema,
    solucao_recomendada: solucao,
    prioridade: sintoma.includes("crítico") ? "Alta" : "Média"
  };
}', 'draft'),

('550e8400-e29b-41d4-a716-446655440000', 'validar_clausula', 'Valida se uma cláusula está em conformidade legal', '{"type": "object", "properties": {"clausula": {"type": "string"}, "tipo_contrato": {"type": "string"}}}', 'function validarClausula(clausula, tipoContrato) {
  const palavrasProibidas = ["abusiva", "ilegal", "inconstitucional"];
  const isValida = !palavrasProibidas.some(palavra => clausula.toLowerCase().includes(palavra));
  
  return {
    valida: isValida,
    tipo_contrato: tipoContrato,
    observacoes: isValida ? "Cláusula em conformidade" : "Revisar cláusula - possível irregularidade"
  };
}', 'draft');

-- Insert sample widget configs
INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, secondary_color, position, size, is_published, embed_count, settings) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Assistente Jurídico', 'Análise de contratos e documentos legais', '#1E40AF', '#DC2626', 'bottom-right', 'large', true, 45, '{"welcome_message": "Olá! Como posso ajudar com questões jurídicas?", "placeholder": "Digite sua dúvida jurídica..."}'),
('550e8400-e29b-41d4-a716-446655440001', 'Consultor Financeiro', 'Análises e recomendações financeiras', '#059669', '#D97706', 'bottom-left', 'medium', true, 32, '{"welcome_message": "Bem-vindo! Precisa de ajuda com investimentos?", "placeholder": "Qual sua dúvida financeira?"}'),
('550e8400-e29b-41d4-a716-446655440002', 'Marketing Expert', 'Estratégias de marketing digital', '#7C3AED', '#EF4444', 'top-right', 'medium', false, 0, '{"welcome_message": "Olá! Vamos criar estratégias de marketing?", "placeholder": "Como posso ajudar com marketing?"}'),
('550e8400-e29b-41d4-a716-446655440003', 'Suporte Técnico', 'Resolução de problemas técnicos', '#0F172A', '#F59E0B', 'bottom-right', 'small', true, 78, '{"welcome_message": "Precisa de ajuda técnica?", "placeholder": "Descreva seu problema técnico..."}');

-- Insert sample analytics data
INSERT INTO agent_analytics (agent_id, date, conversations_count, messages_count, function_calls_count, avg_response_time) VALUES
('550e8400-e29b-41d4-a716-446655440000', '2024-01-15', 12, 48, 15, 2.3),
('550e8400-e29b-41d4-a716-446655440000', '2024-01-16', 8, 32, 10, 1.8),
('550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 15, 60, 22, 3.1),
('550e8400-e29b-41d4-a716-446655440001', '2024-01-16', 18, 72, 28, 2.9),
('550e8400-e29b-41d4-a716-446655440002', '2024-01-15', 6, 24, 8, 2.1),
('550e8400-e29b-41d4-a716-446655440003', '2024-01-15', 25, 100, 35, 1.5);

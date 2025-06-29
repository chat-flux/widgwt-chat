-- Insert sample agents
INSERT INTO agents (id, name, description, system_prompt, personality, color, status, user_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Assistente de Vendas',
    'Especialista em vendas e atendimento ao cliente',
    'Você é um assistente especializado em vendas. Seja sempre educado, prestativo e focado em ajudar o cliente a encontrar a melhor solução.',
    'Profissional e persuasivo',
    '#10B981',
    'active',
    'user_1'
);

INSERT INTO agents (id, name, description, system_prompt, personality, color, status, user_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Assistente de Vendas',
    'Especialista em vendas e atendimento ao cliente',
    'Você é um assistente de vendas experiente. Ajude os clientes a encontrar os melhores produtos e feche vendas de forma natural e consultiva.',
    'Persuasivo e amigável',
    '#10B981',
    'active',
    'user_1'
);

INSERT INTO agents (id, name, description, system_prompt, personality, color, status, user_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Suporte Técnico',
    'Especialista em resolver problemas técnicos',
    'Você é um especialista em suporte técnico. Resolva problemas de forma clara e didática, sempre perguntando detalhes para dar a melhor solução.',
    'Paciente e detalhista',
    '#3B82F6',
    'active',
    'user_1'
);

INSERT INTO agents (id, name, description, system_prompt, personality, color, status, user_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Assistente Jurídico',
    'Especialista em questões legais e contratos',
    'Você é um assistente jurídico. Forneça orientações legais precisas e sempre recomende consultar um advogado para casos complexos.',
    'Formal e preciso',
    '#8B5CF6',
    'inactive',
    'user_1'
);

-- Insert sample conversations
INSERT INTO conversations (id, agent_id, title, status) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'Consulta sobre produtos',
    'active'
);

INSERT INTO conversations (id, agent_id, title, status) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Problema com login',
    'active'
);

INSERT INTO conversations (id, agent_id, title, status) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Orçamento personalizado',
    'archived'
);

-- Insert sample messages
INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    'user',
    'Olá, gostaria de saber mais sobre seus produtos'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    'assistant',
    'Olá! Fico feliz em ajudar você com informações sobre nossos produtos. Temos uma ampla gama de soluções. Em que área você tem mais interesse?'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'user',
    'Olá, estou procurando um produto para minha empresa'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'assistant',
    'Olá! Fico feliz em ajudar você a encontrar o produto ideal para sua empresa. Pode me contar um pouco mais sobre o que vocês fazem e qual tipo de solução estão buscando?'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    'user',
    'Não consigo fazer login no sistema'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    'assistant',
    'Entendo sua dificuldade com o login. Vamos resolver isso juntos. Primeiro, pode me confirmar qual email você está usando para tentar fazer login?'
);

-- Insert sample documents
INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'catalogo-produtos.pdf',
    'Catálogo de Produtos 2024.pdf',
    'application/pdf',
    2048576,
    'Conteúdo do catálogo de produtos...',
    'processed'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'catalogo-produtos.pdf',
    'Catálogo de Produtos 2024.pdf',
    'application/pdf',
    2048576,
    'Conteúdo do catálogo de produtos...',
    'processed'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'manual-tecnico.pdf',
    'Manual Técnico v2.1.pdf',
    'application/pdf',
    1536000,
    'Manual técnico completo...',
    'processed'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'manual-tecnico.pdf',
    'Manual Técnico v2.1.pdf',
    'application/pdf',
    1536000,
    'Manual técnico detalhado...',
    'processed'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'agenda-template.docx',
    'Template de Agenda.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    512000,
    'Template para organização de agenda...',
    'processing'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'contratos-modelo.docx',
    'Modelos de Contratos.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    512000,
    'Modelos de contratos legais...',
    'processing'
);

-- Insert sample functions
INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'calcular_desconto',
    'Calcula desconto baseado no valor e percentual',
    '{"type": "object", "properties": {"valor": {"type": "number"}, "percentual": {"type": "number"}}}',
    'function calcularDesconto(valor, percentual) { return valor * (percentual / 100); }',
    'active'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'calcular_desconto',
    'Calcula desconto baseado no valor e tipo de cliente',
    '{"valor": {"type": "number", "description": "Valor do produto"}, "tipo_cliente": {"type": "string", "description": "Tipo do cliente: novo, regular, vip"}}',
    'function calcularDesconto(valor, tipoCliente) { const descontos = { novo: 0.05, regular: 0.10, vip: 0.15 }; return valor * (descontos[tipoCliente] || 0); }',
    'active'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'verificar_status_sistema',
    'Verifica o status de sistemas internos',
    '{"type": "object", "properties": {"sistema": {"type": "string"}}}',
    'function verificarStatus(sistema) { return "Sistema " + sistema + " operacional"; }',
    'active'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'verificar_status_sistema',
    'Verifica o status dos sistemas principais',
    '{}',
    'function verificarStatusSistema() { return { database: "online", api: "online", frontend: "online", lastCheck: new Date().toISOString() }; }',
    'active'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'criar_lembrete',
    'Cria um lembrete para o usuário',
    '{"type": "object", "properties": {"titulo": {"type": "string"}, "data": {"type": "string"}}}',
    'function criarLembrete(titulo, data) { return "Lembrete criado: " + titulo + " para " + data; }',
    'draft'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'validar_clausula',
    'Valida se uma cláusula está em conformidade',
    '{"clausula": {"type": "string", "description": "Texto da cláusula a ser validada"}}',
    'function validarClausula(clausula) { const palavrasProibidas = ["ilegal", "abusivo"]; return !palavrasProibidas.some(palavra => clausula.toLowerCase().includes(palavra)); }',
    'draft'
);

-- Insert sample widget configs
INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Assistente de Vendas',
    'Como posso ajudar você hoje?',
    '#10B981',
    'bottom-right',
    'Olá! Sou seu assistente de vendas. Como posso ajudar você hoje?',
    'Digite sua pergunta sobre nossos produtos...'
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Assistente de Vendas',
    'Como posso ajudar com suas compras?',
    '#10B981',
    'bottom-right',
    'Olá! Sou seu assistente de vendas. Como posso ajudar você hoje?',
    'Digite sua pergunta sobre nossos produtos...'
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Suporte Técnico',
    'Resolva seus problemas técnicos',
    '#3B82F6',
    'bottom-right',
    'Oi! Estou aqui para resolver seus problemas técnicos. Qual é sua dúvida?',
    'Descreva seu problema técnico...'
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, welcome_message) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Assistente Jurídico',
    'Consultoria jurídica especializada',
    '#8B5CF6',
    'Bem-vindo! Sou seu assistente jurídico. Em que posso orientá-lo?'
);

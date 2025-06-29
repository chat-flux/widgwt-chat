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
    '550e8400-e29b-41d4-a716-446655440002',
    'Assistente Jurídico',
    'Especialista em questões legais e contratos',
    'Você é um assistente jurídico. Forneça orientações legais precisas e sempre recomende consultar um advogado para casos complexos.',
    'Formal e preciso',
    '#8B5CF6',
    'inactive',
    'user_1'
);

INSERT INTO agents (id, name, description, system_prompt, personality, color, status, user_id) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Assistente Pessoal',
    'Ajuda com tarefas do dia a dia e organização',
    'Você é um assistente pessoal prestativo. Ajude com organização, lembretes e tarefas cotidianas de forma amigável.',
    'Amigável e organizado',
    '#F59E0B',
    'active',
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
    'Problema com sistema',
    'active'
);

INSERT INTO conversations (id, agent_id, title, status) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Consulta jurídica',
    'archived'
);

INSERT INTO conversations (id, agent_id, title, status) VALUES
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Organização de agenda',
    'active'
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
    'Estou com problema no sistema de login'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'assistant',
    'Entendo sua dificuldade com o login. Vamos resolver isso juntos. Primeiro, pode me confirmar qual navegador você está usando?'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    'user',
    'Preciso de orientação sobre um contrato'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    'assistant',
    'Claro! Posso ajudar com orientações sobre contratos. Pode me contar mais detalhes sobre o tipo de contrato e sua dúvida específica?'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440003',
    'user',
    'Preciso organizar minha agenda da semana'
);

INSERT INTO messages (conversation_id, role, content) VALUES
(
    '660e8400-e29b-41d4-a716-446655440003',
    'assistant',
    'Perfeito! Vou ajudar você a organizar sua agenda. Quais são suas principais atividades e compromissos desta semana?'
);

-- Insert sample documents
INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'catalogo-produtos.pdf',
    'Catálogo de Produtos 2024.pdf',
    'application/pdf',
    2048576,
    'Conteúdo do catálogo de produtos com especificações técnicas e preços...',
    'processed'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'manual-tecnico.pdf',
    'Manual Técnico v2.1.pdf',
    'application/pdf',
    1536000,
    'Manual técnico completo com procedimentos de troubleshooting...',
    'processed'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'contratos-modelo.docx',
    'Modelos de Contratos.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    512000,
    'Modelos de contratos legais com cláusulas padrão...',
    'processed'
);

INSERT INTO documents (agent_id, filename, original_name, file_type, file_size, content, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'agenda-template.docx',
    'Template de Agenda.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    256000,
    'Template para organização de agenda semanal e mensal...',
    'processed'
);

-- Insert sample functions
INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'calcular_desconto',
    'Calcula desconto baseado no valor e percentual',
    '{"type": "object", "properties": {"valor": {"type": "number", "description": "Valor do produto"}, "percentual": {"type": "number", "description": "Percentual de desconto"}}, "required": ["valor", "percentual"]}',
    'function calcularDesconto(valor, percentual) { 
        if (valor <= 0 || percentual < 0 || percentual > 100) {
            throw new Error("Valores inválidos");
        }
        return valor * (percentual / 100); 
    }',
    'active'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'verificar_status_sistema',
    'Verifica o status de sistemas internos',
    '{"type": "object", "properties": {"sistema": {"type": "string", "description": "Nome do sistema a verificar"}}, "required": ["sistema"]}',
    'function verificarStatus(sistema) { 
        const sistemas = {
            "login": "operacional",
            "database": "operacional", 
            "api": "operacional",
            "frontend": "operacional"
        };
        return sistemas[sistema] || "sistema não encontrado";
    }',
    'active'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'validar_clausula',
    'Valida se uma cláusula está em conformidade legal',
    '{"type": "object", "properties": {"clausula": {"type": "string", "description": "Texto da cláusula a ser validada"}}, "required": ["clausula"]}',
    'function validarClausula(clausula) { 
        const palavrasProibidas = ["ilegal", "abusivo", "discriminatório"];
        const temProblema = palavrasProibidas.some(palavra => 
            clausula.toLowerCase().includes(palavra)
        );
        return {
            valida: !temProblema,
            observacoes: temProblema ? "Cláusula contém termos problemáticos" : "Cláusula aprovada"
        };
    }',
    'active'
);

INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'criar_lembrete',
    'Cria um lembrete para o usuário',
    '{"type": "object", "properties": {"titulo": {"type": "string", "description": "Título do lembrete"}, "data": {"type": "string", "description": "Data do lembrete"}, "prioridade": {"type": "string", "enum": ["baixa", "media", "alta"], "description": "Prioridade do lembrete"}}, "required": ["titulo", "data"]}',
    'function criarLembrete(titulo, data, prioridade = "media") { 
        return {
            id: Date.now(),
            titulo: titulo,
            data: data,
            prioridade: prioridade,
            status: "ativo",
            criado_em: new Date().toISOString()
        };
    }',
    'active'
);

-- Insert sample widget configs
INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder, is_published, embed_count) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Assistente de Vendas',
    'Como posso ajudar você hoje?',
    '#10B981',
    'bottom-right',
    'Olá! Sou seu assistente de vendas. Como posso ajudar você hoje?',
    'Digite sua pergunta sobre nossos produtos...',
    true,
    5
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder, is_published, embed_count) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Suporte Técnico',
    'Resolva seus problemas técnicos',
    '#3B82F6',
    'bottom-right',
    'Oi! Estou aqui para resolver seus problemas técnicos. Qual é sua dúvida?',
    'Descreva seu problema técnico...',
    true,
    3
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder, is_published, embed_count) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Assistente Jurídico',
    'Consultoria jurídica especializada',
    '#8B5CF6',
    'bottom-left',
    'Bem-vindo! Sou seu assistente jurídico. Em que posso orientá-lo?',
    'Digite sua dúvida jurídica...',
    false,
    0
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder, is_published, embed_count) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Assistente Pessoal',
    'Organização e produtividade',
    '#F59E0B',
    'bottom-right',
    'Olá! Sou seu assistente pessoal. Vamos organizar seu dia?',
    'Como posso ajudar com sua organização?',
    true,
    2
);

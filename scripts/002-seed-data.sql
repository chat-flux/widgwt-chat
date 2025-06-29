-- Insert sample agents
INSERT INTO agents (id, name, description, instructions, model, temperature, max_tokens, status, user_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Customer Support Bot', 'AI assistant specialized in customer support and FAQ', 'You are a helpful customer support assistant. Be polite, professional, and try to resolve customer issues efficiently. If you cannot help with something, escalate to a human agent.', 'gpt-4', 0.7, 1000, 'active', 'user_123'),
('550e8400-e29b-41d4-a716-446655440002', 'Sales Assistant', 'AI assistant for sales inquiries and product recommendations', 'You are a knowledgeable sales assistant. Help customers find the right products, answer questions about features and pricing, and guide them through the purchase process.', 'gpt-4', 0.8, 1200, 'active', 'user_123'),
('550e8400-e29b-41d4-a716-446655440003', 'Technical Support', 'AI assistant for technical troubleshooting and support', 'You are a technical support specialist. Help users troubleshoot technical issues, provide step-by-step solutions, and explain technical concepts in simple terms.', 'gpt-4', 0.6, 1500, 'active', 'user_123');

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
    '550e8400-e29b-41d4-a716-446655440004',
    'Assistente Jurídico',
    'Especialista em questões legais e contratos',
    'Você é um assistente jurídico. Forneça orientações legais precisas e sempre recomende consultar um advogado para casos complexos.',
    'Formal e preciso',
    '#8B5CF6',
    'inactive',
    'user_1'
);

-- Insert sample conversations
INSERT INTO conversations (id, agent_id, title, status, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    'Consulta sobre produtos',
    'active',
    '{"customer_id": "cust_001"}'
);

INSERT INTO conversations (id, agent_id, title, status, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Problema com login',
    'active',
    '{"customer_id": "cust_002"}'
);

INSERT INTO conversations (id, agent_id, title, status, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Orçamento personalizado',
    'archived',
    '{"customer_id": "cust_003"}'
);

INSERT INTO conversations (id, agent_id, title, status, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Login Issues',
    'active',
    '{"customer_id": "cust_004"}'
);

INSERT INTO conversations (id, agent_id, title, status, metadata) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Order Status Inquiry', 'active', '{"customer_id": "cust_123", "order_id": "ord_456"}'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Refund Request', 'completed', '{"customer_id": "cust_124", "order_id": "ord_457"}'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Product Recommendation', 'active', '{"customer_id": "cust_125", "product_id": "prod_123"}'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Login Issues', 'active', '{"customer_id": "cust_126", "issue_type": "authentication"}');

-- Insert sample messages
INSERT INTO messages (conversation_id, role, content, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    'user',
    'Olá, gostaria de saber mais sobre seus produtos',
    '{"timestamp": "2023-12-01T10:00:00Z"}'
);

INSERT INTO messages (conversation_id, role, content, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    'assistant',
    'Olá! Fico feliz em ajudar você com informações sobre nossos produtos. Temos uma ampla gama de soluções. Em que área você tem mais interesse?',
    '{"timestamp": "2023-12-01T10:00:30Z"}'
);

INSERT INTO messages (conversation_id, role, content, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'user',
    'Olá, estou procurando um produto para minha empresa',
    '{"timestamp": "2023-12-01T11:00:00Z"}'
);

INSERT INTO messages (conversation_id, role, content, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'assistant',
    'Olá! Fico feliz em ajudar você a encontrar o produto ideal para sua empresa. Pode me contar um pouco mais sobre o que vocês fazem e qual tipo de solução estão buscando?',
    '{"timestamp": "2023-12-01T11:00:15Z"}'
);

INSERT INTO messages (conversation_id, role, content, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    'user',
    'Não consigo fazer login no sistema',
    '{"timestamp": "2023-12-01T12:00:00Z"}'
);

INSERT INTO messages (conversation_id, role, content, metadata) VALUES
(
    '660e8400-e29b-41d4-a716-446655440002',
    'assistant',
    'Entendo sua dificuldade com o login. Vamos resolver isso juntos. Primeiro, pode me confirmar qual email você está usando para tentar fazer login?',
    '{"timestamp": "2023-12-01T12:00:10Z"}'
);

INSERT INTO messages (conversation_id, role, content, metadata) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'user', 'Hi, I want to check the status of my order #12345', '{"timestamp": "2024-01-15T10:00:00Z"}'),
('660e8400-e29b-41d4-a716-446655440001', 'assistant', 'Hello! I''d be happy to help you check your order status. Let me look up order #12345 for you.', '{"timestamp": "2024-01-15T10:00:30Z"}'),
('660e8400-e29b-41d4-a716-446655440002', 'user', 'I''m looking for a good laptop under $1000', '{"timestamp": "2024-01-15T11:00:00Z"}'),
('660e8400-e29b-41d4-a716-446655440002', 'assistant', 'Great! I can help you find the perfect laptop within your budget. What will you primarily use it for?', '{"timestamp": "2024-01-15T11:00:15Z"}'),
('660e8400-e29b-41d4-a716-446655440003', 'user', 'I can''t log into my account', '{"timestamp": "2024-01-15T12:00:00Z"}'),
('660e8400-e29b-41d4-a716-446655440003', 'assistant', 'I''m sorry to hear you''re having trouble logging in. Let''s troubleshoot this step by step.', '{"timestamp": "2024-01-15T12:00:10Z"}');

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

INSERT INTO documents (agent_id, name, content, type, size, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'FAQ Document', 'Frequently Asked Questions: 1. How do I track my order? 2. What is your return policy? 3. How do I contact support?', 'text', 150, '{"category": "support", "language": "en"}'),
('550e8400-e29b-41d4-a716-446655440002', 'Product Catalog', 'Product Information: Laptops, Smartphones, Tablets, Accessories. Features, specifications, and pricing details.', 'text', 500, '{"category": "products", "last_updated": "2024-01-15"}'),
('550e8400-e29b-41d4-a716-446655440003', 'Troubleshooting Guide', 'Common technical issues and solutions: Login problems, Password reset, Account recovery, Browser compatibility.', 'text', 300, '{"category": "technical", "difficulty": "beginner"}');

-- Insert sample functions
INSERT INTO functions (agent_id, name, description, parameters, code, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'check_order_status', 'Check the status of a customer order', '{"type": "object", "properties": {"order_id": {"type": "string", "description": "The order ID to check"}}}', 'function checkOrderStatus(orderId) { return `Order ${orderId} is being processed`; }', 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'process_refund', 'Process a refund request', '{"type": "object", "properties": {"order_id": {"type": "string"}, "reason": {"type": "string"}}}', 'function processRefund(orderId, reason) { return `Refund initiated for order ${orderId}`; }', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'get_product_info', 'Get detailed product information', '{"type": "object", "properties": {"product_id": {"type": "string"}}}', 'function getProductInfo(productId) { return `Product ${productId} details...`; }', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'reset_password', 'Reset user password', '{"type": "object", "properties": {"email": {"type": "string", "description": "User email address"}}}', 'function resetPassword(email) { return `Password reset link sent to ${email}`; }', 'active');

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

-- Insert sample function calls
INSERT INTO function_calls (conversation_id, function_id, input, output, status, execution_time) VALUES
('660e8400-e29b-41d4-a716-446655440001', (SELECT id FROM functions WHERE name = 'check_order_status' LIMIT 1), '{"order_id": "12345"}', '{"status": "shipped", "tracking": "TRK123456"}', 'completed', 250),
('660e8400-e29b-41d4-a716-446655440002', (SELECT id FROM functions WHERE name = 'get_product_recommendations' LIMIT 1), '{"category": "laptops", "budget": 1000}', '{"recommendations": ["Dell XPS 13", "MacBook Air", "ThinkPad X1"]}', 'completed', 180),
('660e8400-e29b-41d4-a716-446655440003', (SELECT id FROM functions WHERE name = 'reset_password' LIMIT 1), '{"email": "user@example.com"}', '{"success": true, "message": "Reset link sent"}', 'completed', 120);

-- Insert sample widget configurations
INSERT INTO widget_configs (agent_id, theme, primary_color, position, welcome_message, placeholder_text, show_agent_name, show_timestamp, enable_voice, enable_file_upload) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'light', '#3b82f6', 'bottom-right', 'Hello! I''m here to help with your customer support needs.', 'How can I assist you today?', true, true, false, true),
('550e8400-e29b-41d4-a716-446655440002', 'dark', '#10b981', 'bottom-left', 'Hi! I''m your sales assistant. Let me help you find what you need.', 'What are you looking for?', true, false, false, false),
('550e8400-e29b-41d4-a716-446655440003', 'light', '#f59e0b', 'bottom-right', 'Technical support here! I''ll help you solve any issues.', 'Describe your technical issue...', true, true, false, true);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder, settings) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Assistente de Vendas',
    'Como posso ajudar você hoje?',
    '#10B981',
    'bottom-right',
    'Olá! Sou seu assistente de vendas. Como posso ajudar você hoje?',
    'Digite sua pergunta sobre nossos produtos...',
    '{"show_agent_avatar": true, "enable_file_upload": false, "max_message_length": 500}'
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder, settings) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Assistente de Vendas',
    'Como posso ajudar com suas compras?',
    '#10B981',
    'bottom-right',
    'Olá! Sou seu assistente de vendas. Como posso ajudar você hoje?',
    'Digite sua pergunta sobre nossos produtos...',
    '{"show_agent_avatar": true, "enable_file_upload": true, "max_message_length": 1000}'
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, position, welcome_message, placeholder, settings) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Suporte Técnico',
    'Resolva seus problemas técnicos',
    '#3B82F6',
    'bottom-right',
    'Oi! Estou aqui para resolver seus problemas técnicos. Qual é sua dúvida?',
    'Descreva seu problema técnico...',
    '{"show_agent_avatar": false, "enable_file_upload": true, "max_message_length": 2000}'
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, welcome_message) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Assistente Jurídico',
    'Consultoria jurídica especializada',
    '#8B5CF6',
    'Bem-vindo! Sou seu assistente jurídico. Em que posso orientá-lo?'
);

INSERT INTO widget_configs (agent_id, title, subtitle, primary_color, welcome_message) VALUES
(
    '550e8400-e29b-41d4-a716-446655440004',
    'Assistente Jurídico',
    'Consultoria jurídica especializada',
    '#8B5CF6',
    'Bem-vindo! Sou seu assistente jurídico. Em que posso orientá-lo?'
);

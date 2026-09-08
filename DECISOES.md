# Decisões

## Tema e stack

A escolha do tema de um portal acadêmico vem da minha iniciação científica, 
onde o ultimo sistema que participei do desenvolvimento foi de um portal para 
submissão de artigos e teses para um departamento da UNIMONTES, e também de 
um módulo de um outro sistema que possuia funções semelhantes. A escolha do 
Laravel foi por ser o primeiro framework que aprendi e que possuo maior domínio
 e foi utilizado na minha iniciação científica, o React foi por ser outro framework
  que aprendi atrvés de projetos feitos na faculdade coma a juda de algumas pessoas 
  que conheci.
Ganhos: Facilidade na construção e integração da aplicação, facilidade na resolução de bugs e melhorias.
Perdas: Maior gasto de tempo em configurações dos frameworks (principalmente do CORS).

## Modelagem

- Nomes de tabelas e campos em inglês (`categories`, `submissions`,
  `author_name`, `title`...) seguindo convenção comum de código,
  enquanto o conteúdo voltado ao usuário (mensagens
  de validação, textos da interface) permanece em português, já que o
  público final do portal é brasileiro.
- Protocolo de acompanhamento gerado automaticamente no formato
  `SUB-{ano}-{6 caracteres aleatórios}`, permitindo que o autor consulte o
  status da submissão sem precisar de conta ou login.

## Pontos em aberto na especificação

- **Painel sem nenhum registro ainda**: exibe um estado vazio explicativo
  em vez de uma tabela em branco, tanto na listagem de submissões quanto
  na de categorias.
- **Submissões de uma categoria desativada**: a referência (`category_id`)
  não é removida nem a submissão é ocultada — ela continua aparecendo
  normalmente no painel, só a categoria some da página pública e do
  formulário. Decisão: o histórico da submissão não deve depender do
  estado atual da categoria.

## Testes

- Bloqueio de acesso de usuários não autenticados
- Recusar login com credenciais inválidas
- Não salvar submissão com dados inválidos

## Além do mínimo

- Upload de PDF na submissão
- Download de PDF feito pelo administrador para avaliação da submissão
- Consulta de status por protocolo, sem exigir login do autor
- Filtro + busca + paginação reais no painel, não só visual

## Uso de IA

**O que delegou para a IA e o que fez à mão, e por quê**:
Designei a construção do scaffolding inicial e o CRUD repetitivo
(controllers, migrations), com revisão e reescrita manual dos pontos de
regra de negócio, como a validação de categoria ativa no momento da
submissão.

**Uma vez em que a IA te deu algo ruim ou errado**:
Em um certo ponto do desenvolvimento, o `AuthController` foi reescrito
para usar autenticação por token Bearer (Sanctum API Tokens), um padrão
válido isoladamente, mas incompatível com o resto do sistema, que já
estava montado para autenticação por sessão via cookie (Sanctum SPA): o
frontend enviava cookies e CSRF token, não um `Authorization: Bearer`.
O login parecia funcionar (retornava 200 com um token que ninguém
consumia), mas toda chamada seguinte falhava com 401, porque nenhuma
sessão real era criada.

**Uma decisão que você tomou contra a sugestão da IA, e o motivo**:
Na escolha do banco a IA sugeriu o MySQL, e prezando pela facilidade do uso do 
sistema decidi utilizar o SQLite por possuir um caonfiguração mais simples para 
a instalação.
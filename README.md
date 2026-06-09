#  AgroSatMobile

**Sistema de Monitoramento Agrícola com Dados de Satélite e Clima**

Projeto desenvolvido para a **Global Solution**, focado na criação de um aplicativo mobile de agro-tecnologia para auxiliar agrônomos e fazendeiros em campo. O aplicativo consome dados climáticos em tempo real e calcula estimativas de saúde da vegetação (NDVI), gerando alertas de risco automáticos e auxiliando na tomada de decisão sustentável.

---

##  Equipe de Desenvolvimento

* **RM 557538** – David Cordeiro
* **RM 555619** – Tiago Morais
* **RM 557065** – Vinicius Augusto
* **RM 556892** – Guilherme Lunghini
* **RM 99856** – Marchel Augusto

---

##  Evidência de Execução

**[🔗 Clique aqui para assistir ao vídeo de demonstração do aplicativo rodando](https://youtu.be/_Xq7p0z5peA)**

O vídeo apresenta o fluxo completo do usuário no aplicativo, incluindo a criação de conta, login, captura de coordenadas via GPS nativo e a exibição dinâmica dos dados meteorológicos e alertas de risco.

---

##  Objetivo do Projeto e Tema

O **AgroSatMobile** atua como um "Painel de Campo" móvel e offline-first em suas premissas de armazenamento. Dentro do tema de agro-tecnologia, o app permite que o produtor rural ou engenheiro agrônomo cadastre sua propriedade utilizando o GPS do dispositivo móvel. 

Com as coordenadas exatas da fazenda em mãos, o sistema se conecta à API pública da *Open-Meteo* para:
1. **Coleta de Dados:** Puxar dados instantâneos de temperatura, umidade, precipitação e velocidade do vento.
2. **Processamento e Análise:** Calcular uma estimativa de **NDVI** (Índice de Vegetação da Diferença Normalizada) baseada no estresse hídrico e nas condições térmicas do local.
3. **Prevenção de Danos:** Disparar alertas imediatos na tela sobre riscos climáticos severos (como Seca extrema ou Ventos Danosos que podem prejudicar a safra).

---

##  Recurso Mobile Nativo Utilizado

**GPS / Localização (`expo-location`)**
O aplicativo faz uso do hardware de GPS do dispositivo para facilitar e trazer precisão ao cadastro das fazendas. Em vez de exigir que o usuário digite coordenadas geográficas complexas manualmente, implementamos a captura automatizada. Com um clique no botão *"Capturar Minha Localização"*, o app solicita a permissão de nível de sistema operacional, faz a leitura das coordenadas em alta precisão e preenche o formulário. Esse recurso é fundamental para garantir que o monitoramento climático bata exatamente com a área real de plantio.

---

##  Funcionalidades Implementadas

O aplicativo atende a um fluxo completo de ponta a ponta (CRUD e consumo de API):
* **Autenticação:** Sistema de registro e login de usuário com validação de credenciais mantidas localmente.
* **Dashboard (Home):** Listagem das fazendas cadastradas, com recurso de exclusão (Delete) mediante confirmação de segurança para evitar perdas acidentais.
* **Cadastro Automatizado:** Formulário de registro de novas áreas agrícolas alimentado pelo GPS nativo do aparelho.
* **Monitoramento e Alertas (Detalhes):** Tela de processamento que consome a API meteorológica em tempo real, formata as informações e exibe *Cards* de alerta com base em regras de negócio (ex: Umidade < 30% e Precipitação = 0 disparam Alerta de Seca Nível Alto).

---

##  Tecnologias e Bibliotecas Utilizadas

A arquitetura do projeto foi desenhada visando performance e código limpo:
* **React Native (com Expo)** - Framework principal para construção da interface multiplataforma.
* **TypeScript** - Adição de tipagem estática forte, prevenindo erros de execução e garantindo consistência no tráfego de dados.
* **React Navigation (Native Stack)** - Gerenciamento de rotas e fluxo de navegação entre as telas.
* **AsyncStorage** - Armazenamento de dados local offline (persistência de contas de usuário e lista de fazendas).
* **Expo Location** - Interface de comunicação com os sensores de geolocalização do smartphone.
* **Open-Meteo API** - Integração externa via `fetch` para consumo de dados meteorológicos de alta precisão.

---

##  Organização e Arquitetura do Projeto

O código foi rigorosamente separado em camadas, dividindo a responsabilidade visual (telas) das regras de negócio (serviços e integrações), espelhando boas práticas de mercado:

```text
AgroSatMobile/
├── src/
│   ├── screens/         # Camada de Apresentação (UI): Home, Login, Cadastro, Detalhes
│   ├── services/        # Camada de Negócio: api.ts com as regras de NDVI e requisições HTTP
│   └── types/           # Camada de Domínio: Interfaces TypeScript padronizando as entidades
├── App.tsx              # Ponto central de inicialização e rotas do React Navigation
└── package.json         # Mapeamento de dependências

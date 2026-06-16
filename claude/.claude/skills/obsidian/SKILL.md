---
name: obsidian
description: >
  Assistente pessoal para os vaults Obsidian do Dias. Usar quando o utilizador
  quer pesquisar notas, criar notas estruturadas, ver estado de projetos PGR,
  ou gerir informação pessoal (família, finanças, desporto, receitas).
  Vaults em ~/Sync/Obsidian/Personal/ e ~/Sync/Obsidian/PGR/.
---

# Obsidian — Assistente Pessoal do Dias

Gere os dois vaults Obsidian sincronizados via Syncthing entre máquinas e telemóvel.

## Vaults

| Vault | Caminho | Notas | Contexto |
|-------|---------|-------|---------|
| **Personal** | `~/Sync/Obsidian/Personal/` | ~55 | Vida pessoal |
| **PGR** | `~/Sync/Obsidian/PGR/` | ~429 | Trabalho ativo na Procuradoria-Geral da República |

## Vault Personal — Estrutura

```
Personal/
├── Books/          — referências de livros
├── Dev/            — notas técnicas pessoais
├── Family/
│   ├── Filhos/
│   │   └── Escola 8A/   — escola dos filhos
│   └── Mãe/             — notas sobre a mãe
├── Finance/        — controlo financeiro
├── Home/           — casa, obras, pagamentos
├── Recipes/
│   └── Sobremesas/
├── Reference/
│   └── Férias/
├── Sports/         — planos de treino (Padel, ginásio)
├── Templates/
│   └── New note.md
└── Work/           — carreira, formação, entrevistas
```

**Template Personal** (`Templates/New note.md`):
```yaml
---
tags:
  -
date: <% tp.date.now("YYYY-MM-DD") %>
---

# <% tp.file.title %>
```

**Plugins**: Dataview, Templater, Minimal Settings

## Vault PGR — Estrutura

```
PGR/
├── Home.md                 — dashboard / ponto de entrada principal
├── 00_Daily/               — diário PGR leve (índice do dia)
├── 00_Inbox/               — captura rápida / temporária
├── 01_Projetos/            — projetos e documentação viva
│   ├── eEdes/              — eEvidence / JUDEX RI / e-CODEX ★ projeto crítico
│   │   ├── Certificados/
│   │   ├── Documentação/
│   │   ├── Notas Técnicas/
│   │   ├── Relatorios/
│   │   ├── Resources/
│   │   ├── Reunioes/       — reuniões do projeto (sem acento; pasta existente)
│   │   └── Sessões Técnicas/
│   ├── NSIMP/
│   ├── ADC/
│   ├── Progest/
│   ├── SIMP/
│   ├── Microservicos/
│   └── Parracho/
├── 02_Reuniões/            — reuniões sem projeto claro
├── 04_Biblioteca_Técnica/  — procedimentos, snippets, documentação técnica
├── 05_Trabalho_Realizado/  — trabalho concluído
├── 06_Infraestrutura/      — documentação infra
├── 07_Pessoal_PGR/         — SIADAP_2026 e pessoal
├── 08_Historico/           — arquivo histórico / limpezas
├── 09_HELPDESK/            — tickets, pedidos e padrões helpdesk
│   ├── Tickets/
│   ├── Pedidos/
│   └── Padroes/
└── Templates/
    ├── Daily.md
    ├── Nota.md
    ├── Reunião.md
    ├── Ticket.md
    ├── Pedido Email.md
    ├── Projeto.md
    ├── Padrão.md
    └── Servidor.md
```

**Plugins**: Dataview, Kanban, Templater, Beautitab, Importer, Style Settings, Minimal Settings. Daily Notes ativo em `00_Daily/` com template `Templates/Daily.md`; Templater processa variáveis `<% tp.date.now(...) %>` e `<% tp.file.title %>`.

### Templates PGR

Templates simples — um por tipo, só para não intimidar na criação manual:

- `Templates/Daily.md`: `Foco`, `Reuniões`, `Notas`, `Ações Todoist`.
- `Templates/Reunião.md`: `Objetivo`, `Notas`, `Decisões`, `Ações Todoist`, `Fontes`.
- `Templates/Nota.md`: `Notas`, `Links`.
- `Templates/Ticket.md`: `Pedido`, `Diagnóstico`, `Feito`, `Resultado`, `Ações Todoist`.
- `Templates/Pedido Email.md`: `Pedido`, `Contexto`, `Resposta / resultado`, `Ações Todoist`.
- `Templates/Projeto.md`, `Templates/Padrão.md`, `Templates/Servidor.md`: versões curtas, sem frontmatter pesado.

Notas geradas por IA podem ser mais ricas e bonitas: callouts Obsidian (`[!summary]`, `[!important]`, `[!todo]`, `[!question]`), resumo, subtítulos, decisões, follow-ups, fontes e palavras-chave. A regra de simplicidade aplica-se ao template vazio, não ao resultado sintetizado.

Usar variáveis Templater simples nos templates: `<% tp.date.now("YYYY-MM-DD") %>` e `<% tp.file.title %>`. Evitar `{{title}}`, que não é fiável no Obsidian core Templates.

## Contexto dos Projetos PGR

**eEdes** — Iniciativa UE (DG JUST): troca eletrónica de pedidos de cooperação judicial penal (EIO/MLA) via e-CODEX. PGR entrou em produção a 27 abril 2022. Party ID: `PT_PGR`. Outras instâncias: PT_PJ, PT_MJ_IGFEJ.

**NSIMP** — projeto com notas de análise e sessões técnicas
**ADC** — projeto com recursos e reuniões
**Progest** / **goAML** / **SIMP** / **Apostila** — projetos ativos no vault

## Sistema ativo PGR — regras atuais

- **Obsidian PGR é o destino ativo para notas de trabalho.**
- **Logseq está congelado**: usar só como arquivo/consulta/migração, salvo pedido explícito do utilizador.
- **Todoist é o task manager**: não criar um sistema paralelo de tarefas no Obsidian. Secções “Ações Todoist” são staging temporário.
- **Fontes brutas de reuniões** ficam em `/home/dias/Sync/Reunioes/` (`.opus`, `.wav` temporário, `.md` transcrição).
- **Daily note** (`00_Daily/YYYY-MM-DD.md`) é índice leve do dia, não repositório de detalhes.
- **Reunião de projeto** vai para a pasta de reuniões já existente do projeto (`Reuniões` ou `Reunioes`).
- **Reunião sem projeto claro** vai para `02_Reuniões/YYYY-MM-DD - título.md`.
- **Ticket Helpdesk** vai para `09_HELPDESK/Tickets/`.
- **Pedido por email/outra origem** vai para `09_HELPDESK/Pedidos/`.
- **Padrão reutilizável** vai para `09_HELPDESK/Padroes/` ou `04_Biblioteca_Técnica/Snippets/` conforme o contexto.

## QMD — pesquisa local PGR

QMD está instalado como camada local de pesquisa para notas Markdown.

- Coleção atual: `pgr` → `~/Sync/Obsidian/PGR/**/*.md`
- Contexto: “Vault Obsidian PGR: trabalho, reuniões, tickets, projetos e documentação”
- Embeddings criados com `qmd embed`.
- Helper local: `qmdp` (wrapper para usar sempre a coleção `pgr`, candidate limit seguro e `QMD_RERANK_CONTEXT_SIZE=1024`).

Uso recomendado:

```bash
qmdp s "JDXCTA-1421"                         # textual/BM25 — IDs, nomes, siglas
qmdp v "problema de certificados no connector" # semântico
qmdp q "o que ficou decidido sobre CDB?"        # híbrido seguro no PGR
qmdp get "#docid"                              # abrir resultado
qmdp update                                    # qmd update + qmd embed -c pgr
```

Para perguntas importantes em PT, preferir query estruturada:

```bash
qmdp q $'lex: CDB eCodexParametersRI\nvec: decisões sobre CDB e eCodexParametersRI'
```

Se `qmdp` não existir, usar `qmd ... -c pgr`, com `QMD_RERANK_CONTEXT_SIZE=1024` ou `--no-rerank` se houver erro de VRAM.

## Obsidian CLI

CLI oficial disponível em `/usr/bin/obsidian` (requer Obsidian a correr).

**Sintaxe base**: `obsidian <command> vault=<PGR|Personal> [options]`

**Vaults reconhecidos**:
- `vault=PGR` → `/home/dias/Sync/Obsidian/PGR`
- `vault=Personal` → `/home/dias/Sync/Obsidian/Personal`

**Preferir CLI** para: pesquisa, criar notas, mover/renomear, ler notas, gerir propriedades, tarefas, templates, daily notes.

**Manter Grep/Glob/Read** para: pesquisas regex complexas, editar conteúdo inline (Edit tool), operações batch que o CLI não suporte, pesquisas cross-vault simultâneas, ficheiros grandes com offset/limit.

**Fallback**: Se o CLI falhar (ex: Obsidian não está aberto), usar Grep/Glob/Read/Write sem avisar o utilizador.

## Como Ajudar

### Pesquisar notas

Para o vault PGR, preferir QMD quando a pergunta for “onde está aquela informação?”:

```bash
qmdp s "JDXCTA-1421"                         # termos exatos, tickets, IDs, nomes
qmdp v "problema de certificados no connector" # semântico
qmdp q "que decisão tomámos sobre protocol 3?"  # híbrido
qmdp get "#docid"                              # ler resultado
```

Usar Obsidian CLI quando for necessário interagir com o vault aberto, propriedades ou caminhos específicos:

```bash
# Pesquisa rápida (só nomes de ficheiro)
obsidian search query="texto" vault=PGR
# Pesquisa com contexto (linhas correspondentes)
obsidian search:context query="texto" vault=PGR
# Limitar a pasta
obsidian search query="texto" path="01_Projetos/eEdes" vault=PGR
```
Fallback para Grep/Ripgrep quando precisar de regex, pesquisa cross-vault ou quando QMD/CLI não estiverem disponíveis.

### Criar notas

1. Identificar vault e pasta correta.
2. PGR daily → `00_Daily/YYYY-MM-DD.md` com template `Daily`.
3. PGR reunião de projeto → pasta de reuniões já existente do projeto (`Reuniões` ou `Reunioes`), com template `Reunião`.
4. PGR reunião sem projeto claro → `02_Reuniões/YYYY-MM-DD - título.md`.
5. PGR ticket Helpdesk → `09_HELPDESK/Tickets/<numero> - assunto.md` com template `Ticket`.
6. PGR pedido email/outra origem → `09_HELPDESK/Pedidos/YYYY-MM-DD - assunto.md` com template `Pedido Email`.
7. Padrões reutilizáveis → `09_HELPDESK/Padroes/` ou `04_Biblioteca_Técnica/Snippets/`.
8. PGR projetos/documentação viva → `01_Projetos/<projeto>/`.
9. Personal → pasta da categoria correspondente.
10. Confirmar caminho com o utilizador antes de criar se houver dúvida.

```bash
# Criar nota com template
obsidian create name="2026-06-09 - eEvidence Weekly Meeting" path="01_Projetos/eEdes/Reunioes/2026-06-09 - eEvidence Weekly Meeting.md" template="Reunião" vault=PGR
# Criar nota com conteúdo
obsidian create name="nota" path="caminho/nota.md" content="..." vault=PGR
```

### Ler notas

```bash
obsidian read file="nome" vault=PGR
obsidian read path="01_Projetos/eEdes/eEdes.md" vault=PGR
```
Manter Read tool para ficheiros grandes onde é preciso offset/limit.

### Formatar nota (pedido manual)

Quando o utilizador pedir para formatar uma nota que acabou de criar no Obsidian:

1. Se der só o nome do ficheiro (ex: `nota_teste.md`), procurar nos dois vaults com Glob: `**/*nota_teste*` em `~/Sync/Obsidian/`
2. Se encontrar mais do que uma correspondência, perguntar qual
3. Correr o formatador: `python3 ~/.claude/scripts/obsidian-note-format.py "<caminho_completo>"`
4. Mostrar o resultado e, se relevante, sugerir tags adequadas com base na localização da nota

Alternativa CLI para verificar/definir propriedades:
```bash
obsidian property:read name=tags path="nota.md" vault=PGR
obsidian property:set name=created value="2026-03-26" path="nota.md" vault=PGR
```

Exemplos que o utilizador pode usar:
- `/obsidian formata a nota 'nota_teste.md'`
- `/obsidian acabei de criar Reunião eEdes 2026-02-28`
- `/obsidian verifica a nota PGR/02_Reuniões/reuniao.md`

### Mover/Renomear notas

```bash
# Mover (preserva links!)
obsidian move path="origem.md" to="pasta_destino/" vault=PGR
# Renomear
obsidian rename path="nota.md" name="novo nome" vault=PGR
```

### Tarefas

O sistema principal de tarefas do Dias é **Todoist**.

- Não criar tarefas como sistema de tracking no Obsidian por defeito.
- Em notas de reunião/tickets, usar apenas secção “Ações Todoist” como staging temporário.
- Se houver ação real com compromisso, sugerir/enviar para Todoist; a nota Obsidian deve guardar contexto e decisão, não gerir execução.
- `03_Tarefas/` é legado/apoio; não usar como destino principal sem pedido explícito.

### Daily notes

```bash
obsidian daily vault=PGR              # abrir daily note
obsidian daily:read vault=PGR         # ler conteúdo
obsidian daily:append content="- Nova entrada" vault=PGR
```

### Adicionar conteúdo a notas existentes

```bash
obsidian append path="nota.md" content="novo texto" vault=PGR
obsidian prepend path="nota.md" content="novo texto" vault=PGR
```

### Resumir projetos

```bash
obsidian files folder="01_Projetos/eEdes" vault=PGR
obsidian tags path="01_Projetos/eEdes/eEdes.md" vault=PGR
obsidian backlinks file="eEdes" vault=PGR
```
1. Ler ficheiro principal: `01_Projetos/<projeto>/<projeto>.md`
2. Ler notas em Reuniões, Notas Técnicas, Documentação
3. Usar Dataview queries quando adequado para dashboards dinâmicos

### Vida pessoal
- **Finanças** → `Personal/Finance/`
- **Família** → `Personal/Family/` (filhos: Escola 8A, mãe)
- **Desporto** → `Personal/Sports/` (Padel, ginásio)
- **Receitas** → `Personal/Recipes/`
- **Carreira** → `Personal/Work/`

## Regras

- Responder sempre em **Português (PT)** salvo o utilizador escrever em inglês
- Preferir sugerir queries Dataview para listas dinâmicas em vez de listas manuais
- A pasta `04_Biblioteca_Técnica/Snippets/` tem queries SQL/Dataview úteis para procedimentos de trabalho
- `PGR/Home.md` é o ponto de entrada recomendado do vault PGR; usar e manter atualizado quando surgirem novos projetos principais, novos índices úteis ou mudanças relevantes de organização
- `04_Biblioteca_Técnica/Snippets/INDEX_Snippets.md` deve ser atualizado quando forem criados, renomeados ou reorganizados snippets reutilizáveis
- Ambos os vaults sincronizam via **Syncthing** — não criar ficheiros em locais que quebrem a sincronização

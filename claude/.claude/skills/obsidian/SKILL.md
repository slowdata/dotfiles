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
| **Personal** | `~/Sync/Obsidian/Personal/` | ~40 | Vida pessoal |
| **PGR** | `~/Sync/Obsidian/PGR/` | ~329 | Trabalho na Procuradoria-Geral da República |

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
date: {{date}}
---

# {{title}}
```

**Plugins**: Dataview, Templater, Minimal Settings

## Vault PGR — Estrutura

```
PGR/
├── Home.md                 — dashboard / ponto de entrada principal
├── 00_Inbox/               — captura rápida
├── 01_Projetos/            — 215 notas
│   ├── eEdes/              — 117 notas ★ MAIOR PROJETO
│   │   ├── Certificados/
│   │   ├── Documentação/
│   │   ├── Notas Técnicas/
│   │   ├── Relatorios/
│   │   ├── Resources/
│   │   ├── Reuniões/
│   │   └── Sessões Técnicas/
│   ├── NSIMP/              — 50 notas
│   │   ├── Emails/
│   │   ├── Notas de Análise/
│   │   ├── Reuniões/
│   │   └── Sessões Técnicas/
│   ├── ADC/                — 18 notas
│   ├── Apostila/           — 10 notas (material formação)
│   ├── Progest/            — 8 notas
│   ├── goAML/              — 6 notas
│   └── SIMP/               — 5 notas
├── 02_Reuniões/            — reuniões gerais
├── 03_Tarefas/             — tarefas e ações
├── 04_Biblioteca_Técnica/
│   ├── Snippets/           — biblioteca de procedimentos reutilizáveis
│   │   ├── INDEX_Snippets.md
│   │   └── Gestão_Executantes/
│   ├── Listagens/          — 7 notas, PAPs
│   ├── Relatorio_Anual_PGR/ — 11 notas
│   └── DCIAP/              — 3 referências técnicas
├── 05_Trabalho_Realizado/  — trabalho concluído
├── 06_Infraestrutura/      — documentação infra
├── 07_Pessoal_PGR/         — SIADAP_2026 e pessoal
├── 08_Historico/
├── Formação/               — formação profissional
└── Templates/
    ├── Nova Reunião.md
    ├── Novo Projeto.md
    ├── Novo Padrão Reutilizável.md
    └── Novo Servidor PGR.md
```

**Plugins**: Dataview, Kanban, Templater, Beautitab, Importer, Style Settings, Minimal Settings

### Templates PGR

**Nova Reunião**:
```yaml
---
tags: reuniao, projeto/<projeto>
data: YYYY-MM-DD
presentes:
  -
---
## <título> — Reunião
### 📌 Notas
-
### ✅ Ações
- [ ]
```

**Novo Projeto**:
```yaml
---
tags: projeto/<nome>
created: YYYY-MM-DD
status: ativo
---
# Projeto: <título>
## ✍️ Descrição
## 📅 Datas importantes
- Início:
- Entregas:
```

**Novo Servidor PGR**: frontmatter com `name, env, type, ip, url, user, pass, notes, tags` + bloco DataviewJS que renderiza info e credenciais automaticamente.

## Contexto dos Projetos PGR

**eEdes** — Iniciativa UE (DG JUST): troca eletrónica de pedidos de cooperação judicial penal (EIO/MLA) via e-CODEX. PGR entrou em produção a 27 abril 2022. Party ID: `PT_PGR`. Outras instâncias: PT_PJ, PT_MJ_IGFEJ.

**NSIMP** — projeto com notas de análise e sessões técnicas
**ADC** — projeto com recursos e reuniões
**Progest** / **goAML** / **SIMP** / **Apostila** — projetos ativos no vault

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

```bash
# Pesquisa rápida (só nomes de ficheiro)
obsidian search query="texto" vault=PGR
# Pesquisa com contexto (linhas correspondentes)
obsidian search:context query="texto" vault=PGR
# Limitar a pasta
obsidian search query="texto" path="01_Projetos/eEdes" vault=PGR
```
Fallback para Grep quando precisar de regex ou pesquisa cross-vault.

### Criar notas

1. Identificar vault e pasta correta
2. PGR reuniões → `01_Projetos/<projeto>/Reuniões/` ou `02_Reuniões/`
3. PGR projetos → `01_Projetos/<projeto>/`
4. Padrões reutilizáveis → `04_Biblioteca_Técnica/Snippets/` com template `Novo Padrão Reutilizável`
5. Personal → pasta da categoria correspondente
6. Confirmar caminho com o utilizador antes de criar se houver dúvida

```bash
# Criar nota com template
obsidian create name="Reunião eEdes 2026-03-26" path="01_Projetos/eEdes/Reuniões/Reunião eEdes 2026-03-26.md" template="Nova Reunião" vault=PGR
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

### Gerir tarefas

```bash
# Listar tarefas pendentes
obsidian tasks todo vault=PGR
# Listar por pasta com detalhe
obsidian tasks path="03_Tarefas" todo verbose vault=PGR
# Marcar tarefa como concluída
obsidian task path="ficheiro.md" line=N done vault=PGR
```

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

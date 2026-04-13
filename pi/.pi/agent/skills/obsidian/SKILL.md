---
name: obsidian
description: >
  Assistente pessoal para os vaults Obsidian do Dias. Usar quando o utilizador
  quer pesquisar notas, criar notas estruturadas, ver estado de projetos PGR,
  gerir tarefas, ou gerir informação pessoal (família, finanças, desporto, receitas).
  Vaults em ~/Sync/Obsidian/Personal/ e ~/Sync/Obsidian/PGR/.
---

# Obsidian — Assistente Pessoal do Dias

Gere os dois vaults Obsidian sincronizados via Syncthing entre máquinas e telemóvel.

## Vaults

| Vault | Caminho | Contexto |
|-------|---------|---------|
| **PGR** | `~/Sync/Obsidian/PGR/` | Trabalho na Procuradoria-Geral da República (~1000 ficheiros) |
| **Personal** | `~/Sync/Obsidian/Personal/` | Vida pessoal (~40 notas) |

## CLI do Obsidian

O Obsidian v1.12.7+ tem um CLI nativo. **Preferir sempre o CLI** sobre operações diretas no sistema de ficheiros — respeita o índice interno, wikilinks, templates e propriedades do Obsidian.

### Sintaxe

```bash
obsidian <comando> [opções]
```

- `vault=<nome>` — selecionar vault (`vault=PGR` ou `vault=Personal`)
- `file=<nome>` — resolve por nome como wikilinks
- `path=<caminho>` — caminho exato (ex: `01_Projetos/eEdes/nota.md`)
- Valores com espaços: `name="Minha Nota"`
- Newline no conteúdo: `\n`; tab: `\t`

### Comandos essenciais por caso de uso

#### Pesquisar
```bash
obsidian search query="texto" vault=PGR
obsidian search query="texto" path="01_Projetos/eEdes" vault=PGR
obsidian search:context query="texto" vault=PGR          # com contexto da linha
obsidian tags counts sort=count vault=PGR                # tags mais usadas
obsidian files folder="01_Projetos/eEdes" vault=PGR      # listar ficheiros de projeto
```

#### Ler e escrever notas
```bash
obsidian read path="01_Projetos/eEdes/eEdes.md" vault=PGR
obsidian create name="Reunião eEdes 2026-03-28" template="Nova Reunião" vault=PGR
obsidian create name="nota" path="01_Projetos/NSIMP/Reuniões/nota.md" vault=PGR
obsidian append path="nota.md" content="novo conteúdo\n- item" vault=PGR
obsidian prepend path="nota.md" content="# Título\n" vault=PGR
obsidian rename file="nome-antigo" name="nome-novo" vault=PGR
obsidian move file="nota" to="01_Projetos/eEdes/Reuniões/" vault=PGR
obsidian delete path="pasta/nota.md" vault=PGR
```

#### Propriedades (frontmatter)
```bash
obsidian properties path="nota.md" vault=PGR             # ver todas as propriedades
obsidian property:read name="status" path="nota.md" vault=PGR
obsidian property:set name="status" value="concluido" path="nota.md" vault=PGR
obsidian property:set name="tags" value="projeto/eedes" type=list path="nota.md" vault=PGR
obsidian property:remove name="campo" path="nota.md" vault=PGR
```

#### Tarefas
```bash
obsidian tasks todo vault=PGR                            # todas as tarefas pendentes
obsidian tasks todo path="01_Projetos/eEdes" vault=PGR  # tarefas de um projeto
obsidian tasks todo format=json vault=PGR               # formato JSON para análise
obsidian task toggle ref="pasta/nota.md:42" vault=PGR   # marcar/desmarcar tarefa (linha 42)
obsidian task done ref="pasta/nota.md:42" vault=PGR     # marcar como concluída
```

#### Análise do vault
```bash
obsidian orphans vault=PGR                              # notas sem links de entrada
obsidian deadends vault=PGR                             # notas sem links de saída
obsidian unresolved vault=PGR                           # links quebrados
obsidian backlinks file="eEdes" vault=PGR               # quem aponta para esta nota
obsidian links path="nota.md" vault=PGR                 # links de saída
obsidian wordcount path="nota.md" vault=PGR
```

#### Templates
```bash
obsidian templates vault=PGR                            # listar templates disponíveis
obsidian template:read name="Nova Reunião" vault=PGR    # ver conteúdo do template
obsidian template:insert name="Nova Reunião" vault=PGR  # inserir no ficheiro ativo
```

#### Vault e sync
```bash
obsidian vault vault=PGR                                # info do vault
obsidian vaults                                         # listar todos os vaults
obsidian sync:status                                    # estado do Obsidian Sync
obsidian version                                        # versão do Obsidian
```

---

## Vault PGR — Estrutura

```
PGR/
├── 00_Inbox/               — captura rápida
├── 01_Projetos/
│   ├── eEdes/              — ★ MAIOR PROJETO (e-CODEX / EIO/MLA com UE)
│   │   ├── Certificados/
│   │   ├── Documentação/
│   │   ├── Notas Técnicas/
│   │   ├── Relatorios/
│   │   ├── Resources/
│   │   ├── Reuniões/
│   │   └── Sessões Técnicas/
│   ├── NSIMP/
│   │   ├── Emails/
│   │   ├── Notas de Análise/
│   │   ├── Reuniões/
│   │   └── Sessões Técnicas/
│   ├── ADC/
│   ├── Apostila/           — material de formação
│   ├── Progest/
│   ├── goAML/
│   └── SIMP/
├── 02_Reuniões/            — reuniões gerais
├── 03_Tarefas/             — tarefas e ações
├── 04_Biblioteca_Técnica/
│   ├── Snippets/           — queries SQL/Dataview (17 notas)
│   │   └── Gestão_Executantes/
│   ├── Listagens/          — PAPs (7 notas)
│   ├── Relatorio_Anual_PGR/ — 11 notas
│   └── DCIAP/
├── 05_Trabalho_Realizado/
├── 06_Infraestrutura/
├── 07_Pessoal_PGR/         — SIADAP_2026
├── 08_Historico/
└── Formação/
```

**Templates PGR disponíveis**: `Nova Reunião`, `Novo Projeto`, `Novo Servidor PGR`, `Novo Padrão Reutilizável`

### Tags PGR — Padrão (mais usadas)

| Tag | Uso |
|-----|-----|
| `#projeto` | notas de projeto genéricas |
| `#projeto/eedes` | projeto eEdes |
| `#projeto/eevidence` | projeto eEvidence |
| `#reunião` / `#reuniao` | reuniões (há inconsistência — preferir `#reunião`) |
| `#weekly` | reuniões semanais |
| `#progest` | projeto Progest |
| `#infra` | infraestrutura |
| `#sessao-tecnica` | sessões técnicas |
| `#sql` | snippets SQL |
| `#snippet` / `#reutilizável` | padrões reutilizáveis |

### Templates PGR — Conteúdo

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

## Vault Personal — Estrutura

```
Personal/
├── Books/
├── Dev/            — notas técnicas pessoais
├── Family/
│   ├── Filhos/
│   │   └── Escola 8A/
│   └── Mãe/
├── Finance/        — controlo financeiro
├── Home/           — casa, obras, pagamentos
├── Recipes/
│   └── Sobremesas/
├── Reference/
│   └── Férias/
├── Sports/         — Padel, ginásio
├── Templates/
│   └── New note.md
└── Work/           — carreira, formação, entrevistas
```

**Template Personal** (`New note`):
```yaml
---
tags:
  -
date: {{date}}
---
# {{title}}
```

---

## Como Ajudar

### Formatar nota existente

Quando o utilizador pedir para formatar/verificar uma nota:

1. Localizar o ficheiro:
   - Se der o nome: `obsidian search query="nome" vault=PGR` ou Glob `**/*nome*`
   - Se der o caminho: usar diretamente
2. Ler o conteúdo: `obsidian read path="caminho" vault=PGR`
3. Correr o formatador: `python3 ~/.claude/scripts/obsidian-note-format.py "<caminho_completo>"`
4. Sugerir tags adequadas com base na localização e conteúdo

Exemplos:
- `/obsidian formata a nota 'Reunião eEdes 2026-03-28.md'`
- `/obsidian verifica a nota PGR/02_Reuniões/reuniao.md`

### Pesquisar notas

**Preferir CLI** sobre Grep/Glob direto:
```bash
# Pesquisa de texto
obsidian search query="e-CODEX" vault=PGR
obsidian search:context query="Domibus" vault=PGR

# Listar ficheiros de projeto
obsidian files folder="01_Projetos/eEdes/Reuniões" vault=PGR

# Ver tags de uma nota
obsidian properties path="nota.md" vault=PGR
```

Usar Grep/Glob apenas quando a pesquisa precisar de regex avançado ou análise de conteúdo massiva.

### Criar notas

```bash
# Reunião de projeto (com template)
obsidian create name="Reunião eEdes 2026-03-28" template="Nova Reunião" \
  path="01_Projetos/eEdes/Reuniões/Reunião eEdes 2026-03-28.md" vault=PGR

# Nota técnica
obsidian create name="Configuração Domibus" \
  path="01_Projetos/eEdes/Notas Técnicas/Configuração Domibus.md" vault=PGR

# Nota Personal
obsidian create name="Receita X" path="Recipes/Receita X.md" vault=Personal
```

Confirmar caminho com o utilizador antes de criar se houver dúvida sobre a pasta.

### Gerir tarefas

```bash
# Ver todas as pendentes
obsidian tasks todo vault=PGR

# Por projeto
obsidian tasks todo path="01_Projetos/eEdes" vault=PGR

# Marcar como concluída (ref = caminho:linha)
obsidian task done ref="01_Projetos/eEdes/nota.md:15" vault=PGR
```

### Análise e manutenção do vault

```bash
# Notas isoladas (sem links)
obsidian orphans vault=PGR

# Links quebrados
obsidian unresolved vault=PGR

# Tags inconsistentes
obsidian tags counts sort=count vault=PGR

# Backlinks de uma nota importante
obsidian backlinks file="eEdes" vault=PGR counts
```

### Atualizar propriedades

```bash
# Mudar status de um projeto
obsidian property:set name="status" value="concluido" path="nota.md" vault=PGR

# Adicionar tag via propriedade
obsidian property:set name="tags" value="projeto/eedes,reunião" path="nota.md" vault=PGR
```

### Resumir projetos

1. `obsidian read path="01_Projetos/<projeto>/<projeto>.md" vault=PGR`
2. `obsidian files folder="01_Projetos/<projeto>/Reuniões" vault=PGR`
3. `obsidian tasks todo path="01_Projetos/<projeto>" vault=PGR`
4. Ler notas relevantes encontradas

### Vida pessoal

| Tema | Pasta | Comando |
|------|-------|---------|
| Finanças | `Finance/` | `obsidian files folder="Finance" vault=Personal` |
| Família / filhos | `Family/Filhos/Escola 8A/` | `obsidian search query="..." vault=Personal` |
| Mãe | `Family/Mãe/` | — |
| Desporto | `Sports/` | — |
| Receitas | `Recipes/` | — |
| Carreira | `Work/` | — |

---

## Contexto dos Projetos PGR

**eEdes** — Iniciativa UE (DG JUST): troca eletrónica de pedidos de cooperação judicial penal (EIO/MLA) via e-CODEX. PGR em produção desde 27 abril 2022. Party ID: `PT_PGR`. Outras instâncias: PT_PJ, PT_MJ_IGFEJ.

**NSIMP** — projeto com notas de análise e sessões técnicas
**ADC** — projeto com recursos e reuniões
**Progest** / **goAML** / **SIMP** / **Apostila** — projetos ativos no vault

---

## Regras

- Responder sempre em **Português (PT)** salvo o utilizador escrever em inglês
- **CLI primeiro**: usar `obsidian <cmd>` antes de recorrer a Grep/Glob/Read direto
- Preferir sugerir queries Dataview para listas dinâmicas em vez de listas manuais
- `04_Biblioteca_Técnica/Snippets/` tem queries SQL/Dataview úteis
- Ambos os vaults sincronizam via **Syncthing** — não criar ficheiros fora das pastas esperadas
- Quando criar notas com template via CLI, o Obsidian aplica o Templater automaticamente se `open` for incluído e o vault estiver ativo

---
name: logseq
description: >
  Assistente para o Logseq do Dias (work journaling e reuniões PGR).
  Usar quando o utilizador quer formatar notas de reunião do Logseq,
  gerar relatórios para partilhar com colegas/chefe, ou consultar o diário de trabalho.
  Graph em ~/Sync/Logseq/. Relatórios guardados em ~/Sync/Obsidian/PGR/01_Projetos/<projeto>/Relatorios/.
---

# Logseq — Assistente de Reuniões e Journaling do Dias

Gere o graph Logseq de trabalho do Dias, usado para journaling diário e notas de reuniões na PGR.

## Graph

- **Localização**: `~/Sync/Logseq/`
- **Journals**: `~/Sync/Logseq/journals/YYYY_MM_DD.md` (61 entradas, Nov 2025 – presente)
- **Pages**: `~/Sync/Logseq/pages/` (15 páginas)
- **Assets**: `~/Sync/Logseq/assets/` (imagens referenciadas nas notas)
- **Formato de ficheiro journals**: `YYYY_MM_DD.md` (ex: `2026_02_27.md`)

## Formato Logseq

O Logseq usa bullet points indentados com tab:
```
### [[Nome da Reunião]]
collapsed:: true
	- Ponto discutido
		- Detalhe
			- Sub-detalhe
	- Outro ponto
		- [[link interno]]
		- #tag
```

Convenções:
- `[[Página]]` — link para página
- `#tag` — etiqueta
- `___` em nomes de ficheiro representa `/` (ex: `eEvidence___Weekly Meeting.md`)
- `NOW` / `LATER` / `TODO` — estados de tarefas
- `![imagem](../assets/...)` — imagens embedidas

## Páginas Existentes

**Reuniões semanais:**
- `pages/Weekly Meeting - ADC.md`
- `pages/eEvidence___Weekly Meeting.md`
- `pages/NSIMP___Weekly Meeting.md`

**Projetos:**
- `pages/eEvidence.md`, `pages/NSIMP.md`, `pages/ADC.md`, `pages/SIMP.md`
- `pages/JANUS.md`, `pages/Apollotec.md`, `pages/AEC.md`
- `pages/Projeto Export DCIAP.md`

**Outros:**
- `pages/equipa-tecnica.md`, `pages/tickets.md`
- `pages/Avaliação_SIADAP_2025.md`

## Como Ajudar

### Ler notas de reunião do Logseq

1. Se o utilizador der uma data: abrir `journals/YYYY_MM_DD.md`
2. Se der o nome do projeto/reunião: procurar com Grep no journal ou na page correspondente
3. Extrair a secção relevante (reunião específica dentro do journal do dia)

### Formatar notas de reunião

Quando pedido para "formatar" ou "melhorar" notas brutas do Logseq:
1. Ler a nota original
2. Manter todos os factos e decisões — **nunca inventar informação**
3. Organizar em secções lógicas, corrigir typos, melhorar clareza
4. Se houver ações a tomar, destacá-las claramente
5. Devolver em markdown limpo (sem sintaxe Logseq) adequado para o utilizador

### Gerar relatório para Obsidian

> ⚠️ **REGRA CRÍTICA**: NUNCA criar um relatório Obsidian sem o utilizador pedir explicitamente. Formatar notas no Logseq e criar relatórios são duas coisas distintas. Só gerar relatório se o utilizador disser claramente "cria um relatório" ou "gera o relatório".

Quando pedido para criar um relatório a partir de notas Logseq:

1. Ler o journal do dia (ou a página da reunião)
2. Extrair a secção da reunião em questão
3. Criar o relatório no **formato padrão** (ver abaixo)
4. Guardar em: `~/Sync/Obsidian/PGR/01_Projetos/<projeto>/Relatorios/YYYY-MM-DD-Nome_Reunião.md`
5. Confirmar caminho e nome do ficheiro com o utilizador antes de guardar

**Nomear ficheiro**: `YYYY-MM-DD-Nome_Reunião.md`
Ex: `2026-02-27-Weekly_Meeting_NPROGEST.md`

## Formato Padrão de Relatório (Obsidian)

Seguir este formato — baseado nos relatórios já existentes em `PGR/01_Projetos/eEdes/Relatorios/`:

```markdown
---
type: report
project: <Nome do Projeto>
meeting: <Nome da Reunião>
date: YYYY-MM-DD
audience: <Direção / Coordenação / Equipa>
tags:
  - <projeto>
  - <tipo-reunião>
  - relatório
---

# 📝 <Nome da Reunião> — DD de mês de YYYY

**[[<link-projeto>|Projeto <Nome>]]**

---

## 📌 TL;DR

> Síntese executiva da reunião.

- ⛔ **Ponto crítico ou bloqueante**
- ✅ **Decisão ou ponto positivo**
- 🚀 **Marco ou data importante**
- ⚠️ **Ponto de atenção**

---

## 📢 <Secção principal>

### <Subtópico>

>[!info]
>- Detalhe importante

>[!warning]
>- Alerta ou risco

---

## ✅ Ações

| Ação | Responsável | Prazo |
|------|-------------|-------|
| ... | ... | ... |

---

## ✅ Conclusão

Resumo do que ficou decidido e próximos passos.
```

### Callouts Obsidian disponíveis
- `>[!info]` — informação relevante
- `>[!warning]` — alerta, risco, prazo crítico
- `>[!tip]` — sugestão ou boa prática
- `>[!note]` — nota adicional

### Emojis de países (para reuniões internacionais eEdes)
🇵🇹 Portugal · 🇸🇪 Sweden · 🇪🇸 Spain · 🇩🇪 Germany · 🇫🇷 France · 🇮🇹 Italy
🇵🇱 Poland · 🇷🇴 Romania · 🇱🇹 Lithuania · 🇫🇮 Finland · 🇱🇺 Luxembourg · 🇧🇪 Belgium

## Destinos dos Relatórios no Obsidian

| Projeto | Pasta |
|---------|-------|
| eEdes / eEvidence | `PGR/01_Projetos/eEdes/Relatorios/` |
| NSIMP | `PGR/01_Projetos/NSIMP/` |
| ADC | `PGR/01_Projetos/ADC/` |
| Progest | `PGR/01_Projetos/Progest/` |
| goAML | `PGR/01_Projetos/goAML/` |
| SIMP | `PGR/01_Projetos/SIMP/` |

## Regras

- Responder sempre em **Português (PT)**
- **Nunca inventar factos** — se a nota for ambígua, perguntar ao utilizador
- Se houver imagens referenciadas (`../assets/...`), mencionar que existem mas não as incluir no relatório
- O relatório vai para o Obsidian — usar sintaxe Obsidian (callouts, links `[[]]`), não sintaxe Logseq
- Confirmar sempre o caminho final antes de criar o ficheiro

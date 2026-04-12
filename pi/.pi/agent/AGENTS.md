# Contexto Global — Dias

## Utilizador

O utilizador chama-se **Dias**. Trabalha em Linux (Omarchy/Arch) e ocasionalmente em Windows 11.

---

## Máquinas

| Hostname      | Tipo                         | OS             | Uso              |
|---------------|------------------------------|----------------|------------------|
| `ossoarchy`   | PC pessoal (casa)            | Omarchy (Arch) | Pessoal          |
| `viarchy`     | Portátil trabalho            | Omarchy (Arch) | Trabalho         |
| `omarchy-pgr` | Workstation trabalho         | Omarchy (Arch) | Trabalho         |
| *(sem nome)*  | Workstation Windows          | Windows 11     | Trabalho (WSL)   |

---

## ⚠️ Contexto de sessão — lê sempre isto antes de agir

**O Dias pode estar numa máquina e a trabalhar noutra via SSH.**

Antes de fazer qualquer alteração a ficheiros, configurações ou sistema:

1. **Identifica em que máquina estás a correr** — `hostname` diz-te onde o agente está a executar
2. **Percebe se o Dias está a trabalhar nessa máquina ou noutra** — pode ter feito SSH de `ossoarchy` para `omarchy-pgr`, por exemplo
3. **Não assumas que a máquina local é a que interessa** — pergunta se não for óbvio pelo contexto

### Exemplo de situação comum

Dias está em casa no `ossoarchy` mas ligado por SSH ao `omarchy-pgr` (workstation do trabalho). Se pedir para "alterar a config do tmux", pode querer dizer:
- A config **remota** (no `omarchy-pgr` onde está a trabalhar)
- A config **local** (nos dotfiles do `ossoarchy` que se propagam a todas as máquinas)

Quando não for claro, **pergunta qual das máquinas** antes de alterar.

---

## Projectos Activos (work in progress)

> ⚠️ Esta informação é do PC pessoal (ossoarchy). O trabalho principal destes projectos
> está em `omarchy-pgr`. Pode haver mais contexto e código actualizado nessa máquina.

Prioridade de execução (por ordem):

### 1. eEvidence — Upgrade 4.0.2 ⚡ urgente
- **O quê:** Sistema EU de cooperação judiciária cross-border (eEvidence directive)
- **Instância:** PT_PGR (Procuradoria-Geral da República)
- **Tarefa:** Upgrade para versão 4.0.2 e validar em QA
- **Deadline:** ~7 dias
- **Código local:** `~/Code/pgr/eevidence/`
- **QA server:** alias SSH `eEvidenceQLD`
- **Stack:** Java/Maven multi-module, Docker, Keycloak, Tomcat
- **Contexto:** Equipa interna PGR assumiu ownership completo (sem Linkare desde 2024)
- **0/4 subtarefas** concluídas

### 2. Forgejo — Instalar no novo servidor
- **O quê:** Instalar Forgejo (git self-hosted) em servidor novo
- **Deadline:** 1 Maio
- **Data início:** Amanhã
- **0/6 subtarefas** concluídas

### 3. Comunicações ao DCIAP — Novo servidor
- **O quê:** Aplicação Laravel 12 + Inertia + Vue 3 para exportação de comunicações hierárquicas ao DCIAP
- **Tarefa:** Colocar aplicação em funcionamento no novo servidor
- **Data:** 20 Abril
- **Código local:** `~/Code/pgr/comunicacoes/`
- **Stack:** Laravel 12, Vue 3, Inertia.js, Tailwind, MySQL (SIMP + PROGEST)
- **0/4 subtarefas** concluídas

### 4. SIMP + PROGEST — Refactoring (sem deadline imediata)
- **O quê:** SIMP é uma aplicação PHP 7.4 monolítica do Ministério Público (4800+ ficheiros)
- **Tarefa:** Melhorar Views e Controllers (metodologia Paul M. Jones — Modernizing Legacy PHP)
- **Código local:** `~/Code/pgr/simp/`
- **Stack:** PHP 7.4, MySQL 5.7, jQuery, Bootstrap 4, ExtJS 6, Docker
- **Refactoring incremental** — não saltar passos, app sempre funcional
- **1/1 subtarefas** concluídas (fase actual)

### 5. Microserviço de Certidões
- **O quê:** Microserviço para gerar certidões
- **Data:** 20 Abril — **Deadline:** 20 Maio
- **0/5 subtarefas** concluídas
- Sem mais contexto disponível em ossoarchy — ver omarchy-pgr

---

## Dotfiles

Todas as máquinas Linux partilham o mesmo repositório de dotfiles:
- **Repo:** `git@github.com:slowdata/dotfiles.git` (branch `main`)
- **Localização:** `~/dotfiles/`
- **Gestão:** GNU Stow
- Alterações ao repo propagam-se a todas as máquinas com `git pull`

---

## Sistema base

Todas as máquinas Linux correm **Omarchy** (Arch Linux).
A skill `/skill:omarchy` tem o contexto técnico completo do sistema, ferramentas e configurações.

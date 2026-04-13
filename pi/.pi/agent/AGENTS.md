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

> ℹ️ Última actualização em `omarchy-pgr` (2026-04-13). O código vive em `~/Code/pgr/` nessa máquina.

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
- **O quê:** Instalar Forgejo (git self-hosted) como sistema de controlo de versões interno da PGR/DPOI
- **Porquê:** Todo o código produzido (proGest, SIMP, microserviços, scripts) corre sem qualquer versionamento — risco real de perda de trabalho
- **Deadline:** 1 Maio 2026
- **Servidor:** `srv_forgejo-prod` — Debian 13 (Trixie), 2 vCPU / 4 GB RAM / 100 GB disco
  - IP interno: `192.168.173.3`
  - SSH alias: `FORGEJO-prod` — chave `~/.ssh/dias_pgr_wsl`
  - URL alvo: `https://git.procuradoria.pt`
- **Stack:** Forgejo 14.0.3 + PostgreSQL 18 + Caddy (reverse proxy HTTPS)
- **Rede:** rede interna + VPN (sem exposição à internet)
  - Porta 443 (HTTPS web) + porta 22 (SSH Git)
  - DNS interno: `git.procuradoria.pt` + certificado CA interna PGR
- **Auth:** local (LDAP fácil de activar posteriormente)
- **Email:** SMTP interno configurado de raiz (logins + notificações)
- **Administrador:** Ricardo Dias; utilizadores: colegas da equipa DPOI
- **Repositórios a criar inicialmente:** proGest (PHP), SIMP (PHP), microserviços Python, scripts de manutenção e deploy
- **0/6 subtarefas** concluídas:
  1. Configuração base do servidor (ferramentas, aliases)
  2. Instalar PostgreSQL 18
  3. Instalar Caddy
  4. Instalar Forgejo 14
  5. Configurar DNS `git.procuradoria.pt` + certificado CA interna
  6. Criar utilizador admin + repositórios iniciais

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
- **Código local:** `~/Code/pgr/simp-dev/`
- **Stack:** PHP 7.4, MySQL 5.7, jQuery, Bootstrap 4, ExtJS 6, Docker
- **Refactoring incremental** — não saltar passos, app sempre funcional
- **1/1 subtarefas** concluídas (fase actual)

### 5. Microserviços SIMP + proGest — Certidões PDF
- **O quê:** Conjunto de microserviços Python/FastAPI que substituem funcionalidades pesadas do proGest e SIMP actualmente geridas por PHP 5.6/Docker com problemas de memória em produção
- **Primeiro serviço prioritário:** geração de certidões PDF (substitui o gerador legacy PHP 5.6)
- **Deadline certidões:** início 20 Abril — entrega 20 Maio 2026
- **Código (novo):** `~/Code/pgr/microservicos/certidao/` — FastAPI + Python
  - `main.py` — API: `POST /certidao`, `GET /health` (porta 5050)
  - `certidao.py` — geração do PDF com reportlab + merge pypdf
  - `db.py` — ligações BD proGest + BD intranet/SIMP
  - `tests/test_compare.py` — comparação automática PHP vs Python
- **Código (legacy / transição):** `~/Code/prod_code/progest_clean/`
  - `php_server/processos/gerar_certidao.sh` — gerador offline em Docker PHP 5.6
  - `php_server/processos/Dockerfile.certidao` — imagem PHP 5.6 descartável
  - `README_CERTIDAO.md` — guia operacional para geração offline
- **Outros microserviços no ecossistema:**
  - `~/Code/pgr/parracho/` — Parracho Importer (importação de jurisprudência, DBF → MySQL, FastAPI)
  - DCIAP export — planeado
- **Servidor destino:** `srv-microservicos-prod` — Debian 13, 4 vCPU / 8 GB RAM / 40 GB
  - IP interno: `192.168.173.81`
  - SSH alias: `microservicos` — chave `~/.ssh/dias_pgr_wsl`
  - DNS interno: `microservicos.procuradoria.pt`
- **Arquitectura de deploy:** Docker Compose + Caddy (porta 8080)
  - `/certidao` → `certidao_service:5050`
  - Futuro: `/juris`, `/dciap`, etc.
- **Dependências externas:**
  - BD proGest: `10.176.64.109:3306`
  - BD intranet/SIMP: `10.176.64.98:3306`
  - NFS File Server (ficheiros de processos) — **pendente da equipa de sistemas**; a rever e validar antes do deploy
- **Config `.env`:** `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `AES_KEY` (desencriptar nomes de utilizadores), `PATH_PROCESSOS`, `PATH_LOGO`, `LOG_FILE`
- **Sem Dockerfile ainda** — corre localmente; Dockerfile/docker-compose a criar na fase de deploy
- **0/5 subtarefas** concluídas:
  1. Criar Dockerfile + docker-compose para certidão service
  2. Configurar ligações BD e variáveis de ambiente no servidor
  3. Resolver/validar mounts NFS (ficheiros de processos)
  4. Deploy para `srv-microservicos-prod`
  5. Validação funcional (teste PHP vs Python com processos reais)

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

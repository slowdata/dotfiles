/**
 * web-search — Extensão de pesquisa web para pi
 *
 * Arquitectura em 3 andares:
 *
 *  SEARCH:
 *    Tier 1 — Brave Search  (BRAVE_SEARCH_API_KEY,  $5 free/mês = 1000 searches)
 *    Tier 2 — Tavily        (TAVILY_API_KEY,         1000/mês free, devolve conteúdo extraído)
 *    Fallback — Bing        (sem key, sempre disponível)
 *
 *  FETCH (url → texto limpo):
 *    Tier 1 — Jina Reader   (r.jina.ai, sem key, handles JS, markdown limpo)
 *    Tier 2 — curl + parser (sempre disponível, fallback automático)
 *    Tier 3 — Firecrawl     (FIRECRAWL_API_KEY, 500 créditos/mês free, never fails)
 *
 *  Regras:
 *    - Search usa o melhor disponível (Brave > Tavily > Bing), por esta ordem.
 *    - Fetch tenta Jina primeiro; se falhar cai para curl; Firecrawl só se pedido
 *      explicitamente (param force="firecrawl") ou se curl devolver <200 chars úteis.
 *
 *  Chaves (adicionar ao ~/.bashrc ou ~/.zshenv):
 *    export BRAVE_SEARCH_API_KEY="..."    # https://brave.com/search/api/
 *    export TAVILY_API_KEY="..."          # https://tavily.com
 *    export FIRECRAWL_API_KEY="..."       # https://firecrawl.dev  (opcional)
 *    export JINA_API_KEY="..."            # https://jina.ai        (opcional, aumenta rate limit)
 */

import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { Type } from "typebox";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { execFile } from "node:child_process";

// execFile como Promise (substituto de pi.exec — mais robusto)
function exec(cmd: string, args: string[], timeoutMs = 20000): Promise<{ stdout: string; exitCode: number; stderr: string }> {
  return new Promise((resolve) => {
    const proc = execFile(cmd, args, { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      resolve({ stdout, stderr: stderr || "", exitCode: err ? (err as any).code ?? 1 : 0 });
    });
    void proc;
  });
}

// ---------------------------------------------------------------------------
// Stats — sessão + total persistido em ficheiro
// ---------------------------------------------------------------------------

const STATS_FILE = join(homedir(), ".pi", "agent", "web-search-stats.json");

// Lê variável do ambiente ou faz fallback para ~/.zshenv
function getKey(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    const zshenv = readFileSync(join(homedir(), ".zshenv"), "utf-8");
    const m = zshenv.match(new RegExp('export ' + name + '="([^"]+)"'));
    if (m) return m[1];
  } catch {}
  return undefined;
}

interface PersistentStats {
  total: number;
  byEngine: Record<string, number>;
  serperMonthly?: { month: string; count: number };
}

const sessionStats = { count: 0, lastEngine: "" };

function loadStats(): PersistentStats {
  try {
    if (existsSync(STATS_FILE)) return JSON.parse(readFileSync(STATS_FILE, "utf-8"));
  } catch {}
  return { total: 0, byEngine: {} };
}

function saveStats(stats: PersistentStats): void {
  try {
    mkdirSync(join(homedir(), ".pi", "agent"), { recursive: true });
    writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch {}
}

function recordSearch(engine: string): PersistentStats {
  sessionStats.count++;
  sessionStats.lastEngine = engine;
  const stats = loadStats();
  stats.total++;
  stats.byEngine[engine] = (stats.byEngine[engine] || 0) + 1;
  saveStats(stats);
  return stats;
}

// ---------------------------------------------------------------------------
// Widget — mostra stats por cima do footer (abaixo do editor)
// ---------------------------------------------------------------------------

const ENGINE_ICONS: Record<string, string> = {
  "Brave Search": "🦁",
  "Tavily":       "⚡",
  "Google":       "🔎",
  "Bing":         "Ⓑ",
};

function serperMonthlyCount(stats: PersistentStats): number {
  const month = new Date().toISOString().slice(0, 7);
  if (!stats.serperMonthly || stats.serperMonthly.month !== month) return 0;
  return stats.serperMonthly.count;
}

function recordSerperUsage(stats: PersistentStats): void {
  const month = new Date().toISOString().slice(0, 7);
  if (!stats.serperMonthly || stats.serperMonthly.month !== month) {
    stats.serperMonthly = { month, count: 1 };
  } else {
    stats.serperMonthly.count++;
  }
}

function updateSearchWidget(ctx: ExtensionContext): void {
  if (!ctx.hasUI || sessionStats.count === 0) return;

  const { lastEngine } = sessionStats;
  const stats = loadStats();
  const total = stats.total;
  const icon  = ENGINE_ICONS[lastEngine] ?? "🔍";
  const theme = ctx.ui.theme;

  const sCount = serperMonthlyCount(stats);
  const sLimit = Number(getKey("SERPER_MONTHLY_LIMIT") ?? 2500);
  const dot    = theme.fg("dim", " ◆ ");
  const sep    = theme.fg("dim", " · ");

  const line1 = [
    " ",
    theme.fg("accent", "🌐 Web Search"),
    dot,
    theme.fg("muted", "último:"),
    " ",
    theme.fg("mdHeading", `${icon} ${lastEngine}`),
    dot,
    theme.fg("warning", String(total)),
    theme.fg("muted", " local"),
    " ",
  ].join("");

  const engineParts = [
    stats.byEngine["Brave Search"] ? theme.fg("mdHeading", `🦁 ${stats.byEngine["Brave Search"]}`) : "",
    stats.byEngine["Google"] ? theme.fg("warning", `🔎 ${stats.byEngine["Google"]}`) : "",
    stats.byEngine["Tavily"] ? theme.fg("accent", `⚡ ${stats.byEngine["Tavily"]}`) : "",
    stats.byEngine["Bing"] ? theme.fg("muted", `Ⓑ ${stats.byEngine["Bing"]}`) : "",
  ].filter(Boolean);

  const line2 = [
    engineParts.length ? ` ${theme.fg("muted", "motores:")} ${engineParts.join(sep)}` : "",
    sCount > 0 ? `${engineParts.length ? sep : " "}${theme.fg("muted", "Serper:")} ${theme.fg("warning", `${sCount}/${sLimit}`)}` : "",
  ].join("");

  const lines = [line1, line2].filter((line) => line.trim().length > 0);
  ctx.ui.setWidget("web-search-stats", lines, { placement: "belowEditor" });
}

// ---------------------------------------------------------------------------
// HTML → Texto limpo (usado como fallback quando Jina não está disponível)
// ---------------------------------------------------------------------------

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function htmlToText(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let doc = bodyMatch ? bodyMatch[1] : html;

  doc = doc
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(nav|header|footer|aside|menu)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `\n\n# ${stripTags(c).trim()}\n\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `\n\n## ${stripTags(c).trim()}\n\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `\n\n### ${stripTags(c).trim()}\n\n`)
    .replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, (_, c) => `\n\n#### ${stripTags(c).trim()}\n\n`)
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, c) => `\n\`\`\`\n${stripTags(c)}\n\`\`\`\n`)
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${stripTags(c)}\``)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => `\n- ${stripTags(c).trim()}`)
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => `\n\n${stripTags(c).trim()}`)
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => `\n> ${stripTags(c).trim()}\n`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|section|article|main|tr)[^>]*>/gi, "\n")
    .replace(/<td[^>]*>/gi, " | ")
    .replace(/<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const t = stripTags(text).trim();
      return t && t !== href ? `${t} (${href})` : t || href;
    })
    .replace(/<[^>]+>/g, "");

  return decodeEntities(doc)
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface SearchResult {
  title: string;
  url: string;
  description: string;
}

function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function queryTerms(query: string): string[] {
  return normalizeText(query)
    .split(" ")
    .filter((t) => t.length >= 3);
}

function isLikelyPersonNameQuery(query: string): boolean {
  const rawTerms = query.trim().split(/\s+/).filter(Boolean);
  if (rawTerms.length < 2 || rawTerms.length > 6) return false;
  if (/["'():\/]|\b(site:|filetype:|OR|AND)\b/i.test(query)) return false;
  const capitalized = rawTerms.filter((t) => /^[A-ZÀ-ÖØ-Þ][\p{L}'-]+$/u.test(t)).length;
  return capitalized >= Math.max(2, rawTerms.length - 1);
}

function coverageScore(text: string, terms: string[]): number {
  if (!terms.length) return 0;
  const hay = normalizeText(text);
  let matched = 0;
  for (const term of terms) if (hay.includes(term)) matched++;
  return matched / terms.length;
}

function hasStrongNameMatch(query: string, result: SearchResult): boolean {
  const q = normalizeText(query);
  const all = `${result.title} ${result.description} ${result.url}`;
  const titleScore = coverageScore(result.title, queryTerms(query));
  const fullScore = coverageScore(all, queryTerms(query));
  const exact = normalizeText(all).includes(q);
  return exact || titleScore >= 0.75 || fullScore >= 0.9;
}

function braveLooksWeak(query: string, results: SearchResult[]): boolean {
  if (!results.length) return true;
  if (!isLikelyPersonNameQuery(query)) return false;
  return !results.slice(0, 5).some((r) => hasStrongNameMatch(query, r));
}

// ---------------------------------------------------------------------------
// SEARCH — Tier 1: Brave
// ---------------------------------------------------------------------------

async function braveSearch(
  pi: ExtensionAPI,
  query: string,
  count: number,
  apiKey: string,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}&extra_snippets=true`;
  const r = await exec("curl", ["-s", "--max-time", "15", "-H", "Accept: application/json", "-H", `X-Subscription-Token: ${apiKey}`, url]);
  if (r.exitCode !== 0) throw new Error(r.stderr || "Brave falhou");
  const json = JSON.parse(r.stdout);
  return (json.web?.results || []).map((item: any) => ({
    title: item.title || "",
    url: item.url || "",
    description: item.extra_snippets?.[0] || item.description || "",
  }));
}

// ---------------------------------------------------------------------------
// SEARCH — Tier 2: Tavily (devolve conteúdo extraído, não só snippets)
// ---------------------------------------------------------------------------

async function tavilySearch(
  pi: ExtensionAPI,
  query: string,
  count: number,
  apiKey: string,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  const body = JSON.stringify({
    query,
    max_results: count,
    search_depth: "basic",
    include_answer: false,
    include_raw_content: false,
    api_key: apiKey,
  });
  const r = await exec("curl", [
    "-s", "--max-time", "20",
    "-X", "POST",
    "-H", "Content-Type: application/json",
    "-d", body,
    "https://api.tavily.com/search",
  ]);
  if (r.exitCode !== 0) throw new Error(r.stderr || "Tavily falhou");
  const json = JSON.parse(r.stdout);
  return (json.results || []).map((item: any) => ({
    title: item.title || "",
    url: item.url || "",
    description: item.content || "",
  }));
}

// ---------------------------------------------------------------------------
// SEARCH — Tier Google via Serper.dev (resultados reais do Google, 2500/mês free)
// ---------------------------------------------------------------------------

async function serperSearch(
  pi: ExtensionAPI,
  query: string,
  count: number,
  apiKey: string,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  const body = JSON.stringify({ q: query, num: Math.min(count, 10) });
  const r = await exec("curl", [
    "-s", "--max-time", "15",
    "-X", "POST",
    "-H", "Content-Type: application/json",
    "-H", `X-API-KEY: ${apiKey}`,
    "-d", body,
    "https://google.serper.dev/search",
  ]);
  if (r.exitCode !== 0) throw new Error(r.stderr || "Serper falhou");
  const json = JSON.parse(r.stdout);
  return (json.organic || []).map((item: any) => ({
    title: item.title || "",
    url: item.link || "",
    description: item.snippet || "",
  }));
}

// ---------------------------------------------------------------------------
// SEARCH — Fallback: Bing scraping (sem key)
// ---------------------------------------------------------------------------

function normalizeBingCiteUrl(cite: string): string {
  const decoded = decodeEntities(cite).trim();
  return decoded.startsWith("http") ? decoded.replace(/\s*›\s*/g, "/") : decoded;
}

async function bingSearch(
  pi: ExtensionAPI,
  query: string,
  count: number,
  signal?: AbortSignal
): Promise<SearchResult[]> {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=${count}`;
  const r = await exec("curl", [
    "-s", "--max-time", "15", "-L",
    "-A", "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
    "-H", "Accept: text/html", "-H", "Accept-Language: pt-PT,pt;q=0.9,en;q=0.8",
    url,
  ]);
  if (r.exitCode !== 0) throw new Error(r.stderr || "Bing falhou");
  const html = r.stdout;
  const titles = [...html.matchAll(/<h2[^>]*>.*?>([\s\S]*?)<\/a>/g)];
  const cites = [...html.matchAll(/<cite[^>]*>([\s\S]*?)<\/cite>/g)];
  const snippets = [...html.matchAll(/<p class="b_lineclamp[^"]*"[^>]*>([\s\S]*?)<\/p>/g)];
  const results: SearchResult[] = [];
  const max = Math.min(count, titles.length, cites.length);
  for (let i = 0; i < max; i++) {
    const title = decodeEntities(stripTags(titles[i][1])).trim();
    const url = normalizeBingCiteUrl(stripTags(cites[i][1]));
    const description = snippets[i] ? decodeEntities(stripTags(snippets[i][1])).trim() : "";
    if (title && url) results.push({ title, url, description });
  }
  return results;
}

// ---------------------------------------------------------------------------
// FETCH — Tier 1: Jina Reader (r.jina.ai)
// Converte qualquer URL para Markdown limpo, aguenta JavaScript
// ---------------------------------------------------------------------------

async function jinaFetch(
  pi: ExtensionAPI,
  url: string,
  signal?: AbortSignal
): Promise<{ text: string; ok: boolean }> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const headers: string[] = [
    "-H", "Accept: text/plain, text/markdown",
    "-H", "X-Return-Format: markdown",
    "-H", "X-Remove-Selector: nav, header, footer, aside",
  ];
  const jinaKey = getKey("JINA_API_KEY");
  if (jinaKey) headers.push("-H", `Authorization: Bearer ${jinaKey}`);

  const r = await exec("curl", [
    "-s", "-L", "--max-time", "25", "--compressed",
    "-A", "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
    ...headers,
    jinaUrl,
  ]);

  if (r.exitCode !== 0) return { text: "", ok: false };
  const text = r.stdout.trim();
  return { text, ok: text.length > 200 };
}

// ---------------------------------------------------------------------------
// FETCH — Tier 2: curl + parser HTML
// ---------------------------------------------------------------------------

async function curlFetch(
  pi: ExtensionAPI,
  url: string,
  signal?: AbortSignal
): Promise<{ text: string; ok: boolean }> {
  const r = await exec("curl", [
    "-s", "-L", "--max-time", "20", "--compressed",
    "-A", "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
    "-H", "Accept: text/html,application/xhtml+xml,application/json,text/plain,*/*;q=0.9",
    "-H", "Accept-Language: pt-PT,pt;q=0.9,en;q=0.8",
    url,
  ]);

  if (r.exitCode !== 0) return { text: "", ok: false };
  const body = r.stdout;
  const isHtml = body.trimStart().startsWith("<") || /<html|<!DOCTYPE/i.test(body.slice(0, 500));
  const text = isHtml ? htmlToText(body) : body;
  return { text, ok: text.length > 100 };
}

// ---------------------------------------------------------------------------
// FETCH — Tier 3: Firecrawl (last resort — never fails)
// ---------------------------------------------------------------------------

async function firecrawlFetch(
  pi: ExtensionAPI,
  url: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<{ text: string; ok: boolean }> {
  const body = JSON.stringify({ url, formats: ["markdown"] });
  const r = await exec("curl", [
    "-s", "--max-time", "30",
    "-X", "POST",
    "-H", "Content-Type: application/json",
    "-H", `Authorization: Bearer ${apiKey}`,
    "-d", body,
    "https://api.firecrawl.dev/v1/scrape",
  ]);

  if (r.exitCode !== 0) return { text: "", ok: false };
  let json: any;
  try { json = JSON.parse(r.stdout); } catch { return { text: "", ok: false }; }
  const text = json.data?.markdown || json.markdown || "";
  return { text, ok: text.length > 100 };
}

// ---------------------------------------------------------------------------
// Extensão principal
// ---------------------------------------------------------------------------

export default function webSearchExtension(pi: ExtensionAPI) {

  // Restaurar widget se já houve pesquisas nesta sessão
  pi.on("session_start", async (_event, ctx) => {
    // Reset de sessão (nova sessão = novo contador)
    sessionStats.count = 0;
    sessionStats.lastEngine = "";
  });


  // ------------------------------------------------------------------
  // web_search
  // ------------------------------------------------------------------
  pi.registerTool({
    name: "web_search",
    label: "Web Search",
    description:
      "Pesquisa na web por informação actualizada, documentação, changelogs, notícias ou qualquer tema. " +
      "Devolve lista de resultados com títulos, URLs e resumos. " +
      "Combina com web_fetch para ler o conteúdo completo de qualquer resultado.",
    promptSnippet: "Pesquisa na web por informação actual ou documentação",
    promptGuidelines: [
      "Usa web_search quando precisas de informação actual, changelogs, documentação ou qualquer coisa que possa não estar no teu treino.",
      "Após web_search, usa web_fetch para ler o conteúdo completo dos resultados mais relevantes.",
      "Para deep research: web_search para descobrir URLs relevantes, depois web_fetch para ler cada página em detalhe.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "Pesquisa a efectuar" }),
      max_results: Type.Optional(Type.Number({ description: "Máximo de resultados (1-10, padrão: 5)" })),
    }),

    async execute(_id, params, signal, onUpdate, ctx) {
      const count      = Math.min(Math.max(params.max_results ?? 5, 1), 10);
      const braveKey    = getKey("BRAVE_SEARCH_API_KEY");
      const tavilyKey   = getKey("TAVILY_API_KEY");
      const serperKey   = getKey("SERPER_API_KEY");
      const serperLimit = Number(getKey("SERPER_MONTHLY_LIMIT") ?? 2500);

      onUpdate?.({ content: [{ type: "text", text: `A pesquisar: "${params.query}"...` }] });

      let results: SearchResult[] = [];
      let source = "";
      let errors: string[] = [];

      let braveWeak = false;

      // Tier 1: Brave
      if (braveKey) {
        try {
          results = await braveSearch(pi, params.query, count, braveKey, signal);
          source = "Brave Search";
          braveWeak = braveLooksWeak(params.query, results);
          if (braveWeak) {
            onUpdate?.({ content: [{ type: "text", text: `Brave devolveu resultados fracos para "${params.query}"; a tentar Google...` }] });
          }
        } catch (e: any) { errors.push(`Brave: ${e.message}`); }
      }

      // Tier 2: Serper / Google (se Brave vazio/fraco + key + abaixo do limite mensal)
      if ((!results.length || braveWeak) && serperKey) {
        const stats = loadStats();
        const used  = serperMonthlyCount(stats);
        if (used < serperLimit) {
          try {
            const googleResults = await serperSearch(pi, params.query, count, serperKey, signal);
            if (googleResults.length) {
              results = googleResults;
              source  = "Google";
              recordSerperUsage(stats);
              saveStats(stats);
              braveWeak = false;
            }
          } catch (e: any) { errors.push(`Serper/Google: ${e.message}`); }
        } else {
          errors.push(`Serper: limite mensal atingido (${used}/${serperLimit})`);
        }
      }

      // Tier 3: Tavily
      if (!results.length && tavilyKey) {
        try {
          results = await tavilySearch(pi, params.query, count, tavilyKey, signal);
          source = "Tavily";
        } catch (e: any) { errors.push(`Tavily: ${e.message}`); }
      }

      // Fallback: Bing
      if (!results.length) {
        try {
          results = await bingSearch(pi, params.query, count, signal);
          source = "Bing";
        } catch (e: any) { errors.push(`Bing: ${e.message}`); }
      }

      // Sugestões de upgrade só quando a pesquisa falha
      const tips: string[] = [];
      if (!braveKey && !tavilyKey) tips.push("💡 **Brave API** (grátis): https://brave.com/search/api/ → define `BRAVE_SEARCH_API_KEY`");
      if (!tavilyKey) tips.push("⚡ **Tavily** (grátis, mais conteúdo): https://tavily.com → define `TAVILY_API_KEY`");
      const tipBlock = tips.length ? `\n\n> ${tips.join("\n> ")}` : "";

      if (!results.length) {
        return {
          content: [{ type: "text", text: `Todas as opções de pesquisa falharam:\n${errors.join("\n")}${tipBlock}` }],
          isError: true, details: {},
        };
      }

      // Actualizar stats e widget
      recordSearch(source);
      updateSearchWidget(ctx);

      const lines = results.map((r, i) => `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.description}`);

      return {
        content: [{ type: "text", text: `Resultados de ${source} para "${params.query}":\n\n${lines.join("\n\n")}` }],
        details: { results, query: params.query, source },
      };
    },
  });

  // ------------------------------------------------------------------
  // web_fetch
  // ------------------------------------------------------------------
  pi.registerTool({
    name: "web_fetch",
    label: "Web Fetch",
    description:
      "Obtém o conteúdo completo de uma página web e devolve-o como texto legível. " +
      "Usa Jina Reader por defeito (aguenta JavaScript). " +
      "Se falhar, cai para curl. Se ambos falharem e FIRECRAWL_API_KEY estiver definida, usa Firecrawl (never fails). " +
      "Ideal para ler documentação, artigos, changelogs, ficheiros GitHub, RFCs, man pages online, etc.",
    promptSnippet: "Obtém e lê o conteúdo completo de uma URL",
    promptGuidelines: [
      "Usa web_fetch para ler o conteúdo completo de qualquer URL — documentação, artigos, changelogs, GitHub.",
      "web_fetch não precisa de API key e funciona sempre.",
      "Se o conteúdo for truncado, aumenta max_chars (máximo 25000).",
      "Para páginas que bloqueiam scrapers, usa force='firecrawl' se FIRECRAWL_API_KEY estiver disponível.",
    ],
    parameters: Type.Object({
      url: Type.String({ description: "URL a obter" }),
      max_chars: Type.Optional(Type.Number({ description: "Máximo de caracteres (padrão: 10000, máximo: 25000)" })),
      force: Type.Optional(Type.String({ description: "Forçar método: 'jina' | 'curl' | 'firecrawl'" })),
    }),

    async execute(_id, params, signal, onUpdate) {
      const maxChars = Math.min(params.max_chars ?? 10000, 25000);
      const firecrawlKey = getKey("FIRECRAWL_API_KEY");
      const forced = params.force;

      onUpdate?.({ content: [{ type: "text", text: `A obter ${params.url}...` }] });

      let text = "";
      let usedMethod = "";

      if (forced === "curl") {
        const r = await curlFetch(pi, params.url, signal);
        text = r.text;
        usedMethod = "curl";
      } else if (forced === "firecrawl") {
        if (!firecrawlKey) {
          return { content: [{ type: "text", text: "FIRECRAWL_API_KEY não definida. Define-a para usar Firecrawl." }], isError: true, details: {} };
        }
        const r = await firecrawlFetch(pi, params.url, firecrawlKey, signal);
        text = r.text;
        usedMethod = "Firecrawl";
      } else {
        // Auto: Jina → curl → Firecrawl
        onUpdate?.({ content: [{ type: "text", text: `A obter via Jina Reader...` }] });
        const jina = await jinaFetch(pi, params.url, signal);
        if (jina.ok) {
          text = jina.text;
          usedMethod = "Jina Reader";
        } else {
          onUpdate?.({ content: [{ type: "text", text: `Jina falhou, a tentar curl directo...` }] });
          const curl = await curlFetch(pi, params.url, signal);
          if (curl.ok) {
            text = curl.text;
            usedMethod = "curl";
          } else if (firecrawlKey) {
            onUpdate?.({ content: [{ type: "text", text: `curl insuficiente, a usar Firecrawl (last resort)...` }] });
            const fc = await firecrawlFetch(pi, params.url, firecrawlKey, signal);
            text = fc.text;
            usedMethod = "Firecrawl";
          } else {
            text = curl.text || jina.text;
            usedMethod = "curl (parcial)";
          }
        }
      }

      if (!text) {
        const hint = !firecrawlKey
          ? "\n\n💡 Define `FIRECRAWL_API_KEY` para activar o last resort (https://firecrawl.dev — 500 créditos/mês grátis)"
          : "";
        return {
          content: [{ type: "text", text: `Não foi possível obter conteúdo de ${params.url}.${hint}` }],
          isError: true, details: { url: params.url },
        };
      }

      const truncated = text.length > maxChars;
      const output = truncated
        ? text.slice(0, maxChars) + `\n\n[... truncado a ${maxChars} chars. Total: ${text.length}. Usa max_chars para ver mais.]`
        : text;

      return {
        content: [{ type: "text", text: output }],
        details: { url: params.url, method: usedMethod, totalChars: text.length, truncated },
      };
    },
  });
}

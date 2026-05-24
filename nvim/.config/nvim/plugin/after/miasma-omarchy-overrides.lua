-- Omarchy Miasma overrides for LazyVim/plugin UI.
-- Keep the palette army-green/gold/brown instead of cyan/blue-heavy defaults.

local palette = {
  bg = "#222222",
  surface = "#2a2a2a",
  surface2 = "#343434",
  selected = "#3e3e3e",
  fg = "#c2c2b0",
  muted = "#8a8a7a",
  dim = "#666660",
  accent = "#78824b",
  gold = "#c9a554",
  orange = "#b36d43",
  orange_brown = "#bb7744",
  green = "#5f875f",
  brown = "#685742",
  sand = "#d7c483",
}

local function hl(group, opts)
  vim.api.nvim_set_hl(0, group, opts)
end

local function apply()
  if vim.g.colors_name ~= "miasma" then
    return
  end

  -- Core editor
  hl("Normal", { fg = palette.fg })
  hl("NormalNC", { fg = palette.fg })
  hl("CursorLine", { bg = palette.surface2 })
  hl("Visual", { bg = palette.selected })
  hl("Search", { bg = palette.gold, fg = palette.bg, bold = true })
  hl("IncSearch", { bg = palette.orange, fg = palette.bg, bold = true })
  hl("LineNr", { fg = palette.dim })
  hl("CursorLineNr", { fg = palette.gold, bold = true })
  hl("WinSeparator", { fg = palette.dim })
  hl("VertSplit", { fg = palette.dim })

  -- Syntax / Treesitter
  hl("Identifier", { fg = palette.fg })
  hl("Function", { fg = palette.gold })
  hl("Type", { fg = palette.accent })
  hl("Keyword", { fg = palette.orange_brown })
  hl("Statement", { fg = palette.orange_brown })
  hl("Conditional", { fg = palette.orange_brown })
  hl("Repeat", { fg = palette.orange_brown })
  hl("String", { fg = palette.green })
  hl("Number", { fg = palette.orange })
  hl("Boolean", { fg = palette.orange })
  hl("Constant", { fg = palette.sand })
  hl("Comment", { fg = palette.dim, italic = true })
  hl("Special", { fg = palette.gold })
  hl("Operator", { fg = palette.fg })
  hl("Delimiter", { fg = palette.muted })

  for group, color in pairs({
    ["@variable"] = palette.fg,
    ["@variable.member"] = palette.green,
    ["@variable.parameter"] = palette.fg,
    ["@property"] = palette.green,
    ["@field"] = palette.green,
    ["@function"] = palette.gold,
    ["@function.method"] = palette.gold,
    ["@constructor"] = palette.accent,
    ["@type"] = palette.accent,
    ["@type.builtin"] = palette.accent,
    ["@keyword"] = palette.orange_brown,
    ["@keyword.function"] = palette.orange_brown,
    ["@keyword.return"] = palette.orange_brown,
    ["@string"] = palette.green,
    ["@number"] = palette.orange,
    ["@boolean"] = palette.orange,
    ["@constant"] = palette.sand,
    ["@operator"] = palette.fg,
    ["@punctuation.delimiter"] = palette.muted,
    ["@punctuation.bracket"] = palette.muted,
    ["@comment"] = palette.dim,
  }) do
    hl(group, { fg = color })
  end

  -- Neo-tree
  hl("NeoTreeDirectoryIcon", { fg = palette.accent, bold = true })
  hl("NeoTreeDirectoryName", { fg = palette.accent, bold = true })
  hl("NeoTreeRootName", { fg = palette.gold, bold = true })
  hl("NeoTreeFileName", { fg = palette.fg })
  hl("NeoTreeFileNameOpened", { fg = palette.sand, bold = true })
  hl("NeoTreeIndentMarker", { fg = palette.dim })
  hl("NeoTreeExpander", { fg = palette.muted })
  hl("NeoTreeCursorLine", { bg = palette.surface2 })
  hl("NeoTreeGitAdded", { fg = palette.green })
  hl("NeoTreeGitModified", { fg = palette.gold })
  hl("NeoTreeGitDeleted", { fg = palette.brown })
  hl("NeoTreeGitUntracked", { fg = palette.orange })

  -- Bufferline / tabs
  hl("BufferLineFill", { bg = palette.surface })
  hl("BufferLineBackground", { fg = palette.muted, bg = palette.surface })
  hl("BufferLineBufferSelected", { fg = palette.fg, bg = palette.surface2, bold = true, italic = true })
  hl("BufferLineIndicatorSelected", { fg = palette.accent, bg = palette.surface2 })
  hl("BufferLineModified", { fg = palette.gold, bg = palette.surface })
  hl("BufferLineModifiedSelected", { fg = palette.gold, bg = palette.surface2 })
  hl("BufferLineTab", { fg = palette.muted, bg = palette.surface })
  hl("BufferLineTabSelected", { fg = palette.fg, bg = palette.surface2, bold = true })

  -- Statusline / tabline / floating UI
  hl("StatusLine", { fg = palette.fg, bg = palette.surface2 })
  hl("StatusLineNC", { fg = palette.muted, bg = palette.surface })
  hl("TabLine", { fg = palette.muted, bg = palette.surface })
  hl("TabLineSel", { fg = palette.bg, bg = palette.accent, bold = true })
  hl("TabLineFill", { bg = palette.surface })
  hl("NormalFloat", { fg = palette.fg, bg = palette.surface })
  hl("FloatBorder", { fg = palette.accent, bg = palette.surface })
  hl("Pmenu", { fg = palette.fg, bg = palette.surface })
  hl("PmenuSel", { fg = palette.bg, bg = palette.gold, bold = true })
  hl("PmenuSbar", { bg = palette.surface2 })
  hl("PmenuThumb", { bg = palette.accent })

  -- Diagnostics
  hl("DiagnosticHint", { fg = palette.accent })
  hl("DiagnosticInfo", { fg = palette.accent })
  hl("DiagnosticWarn", { fg = palette.gold })
  hl("DiagnosticError", { fg = palette.orange_brown })
end

vim.api.nvim_create_autocmd({ "ColorScheme", "VimEnter" }, {
  callback = function()
    vim.schedule(function()
      apply()
      vim.defer_fn(apply, 20)
      vim.defer_fn(apply, 100)
    end)
  end,
})

apply()
vim.defer_fn(apply, 100)

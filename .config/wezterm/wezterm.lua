local wezterm = require("wezterm")

local color_scheme = wezterm.color.get_builtin_schemes()["Catppuccin Mocha"]
color_scheme.background = '#0e0e1e'
local transparent_background = 'rgba(14, 14, 30, 0.8)'

local SOLID_LEFT_ARROW = wezterm.nerdfonts.ple_lower_right_triangle
local SOLID_RIGHT_ARROW = wezterm.nerdfonts.ple_upper_left_triangle

function tab_title(tab_info)
  local title = tab_info.tab_title
  if title and #title > 0 then
    return title
  end
  return tab_info.active_pane.title
end

wezterm.on(
  'format-tab-title',
  function(tab, tabs, panes, config, hover, max_width)
    local edge_background = transparent_background
    local background = '#0e0e1e'
    local edge_foreground = 'rgba(14, 14, 30,0)'
    local foreground = color_scheme.foreground

    if tab.is_active then
      background = '#9278b6'
      foreground = color_scheme.background
      edge_foreground = background
    elseif hover then
      background = color_scheme.selection_bg
      edge_foreground = background
    end

    local title = tab_title(tab)

    title = wezterm.truncate_right(title, max_width - 2)

    return {
      { Background = { Color = edge_background } },
      { Foreground = { Color = edge_foreground } },
      { Text = SOLID_LEFT_ARROW },
      { Background = { Color = background } },
      { Foreground = { Color = foreground } },
      { Text = title },
      { Background = { Color = edge_background } },
      { Foreground = { Color = edge_foreground } },
      { Text = SOLID_RIGHT_ARROW },
    }
  end
)


return {
  enable_wayland = true,
  color_schemes = {
    ["custoppuccin"] = color_scheme,
  },
  color_scheme = "custoppuccin",
  colors = {
		tab_bar = {
			background = transparent_background,
		},
	},

  use_fancy_tab_bar = false,
	hide_tab_bar_if_only_one_tab = true,
  tab_bar_style = {
    new_tab = wezterm.format({
      { Background = { Color = transparent_background } },
      { Foreground = { Color = 'rgba(14,14,30,0)' } },
      { Text = SOLID_LEFT_ARROW },
      { Background = { Color = color_scheme.background } },
      { Foreground = { Color = color_scheme.foreground} },
      { Text = '+' },
      { Background = { Color = transparent_background } },
      { Foreground = { Color = 'rgba(14,14,30,0)' } },
      { Text = SOLID_RIGHT_ARROW },
    }),
    new_tab_hover = wezterm.format({
      { Background = { Color = transparent_background } },
      { Foreground = { Color = color_scheme.selection_bg } },
      { Text = SOLID_LEFT_ARROW },
      { Background = { Color = color_scheme.selection_bg } },
      { Foreground = { Color = color_scheme.foreground} },
      { Text = '+' },
      { Background = { Color = transparent_background } },
      { Foreground = { Color = color_scheme.selection_bg } },
      { Text = SOLID_RIGHT_ARROW },
    }),

  },

	font = wezterm.font("CaskaydiaCove NF"),
  font_size = 10,

	window_close_confirmation = "NeverPrompt",

	window_background_opacity = 0.8,
	text_background_opacity = 1,
}

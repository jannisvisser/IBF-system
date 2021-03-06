header <- dashboardHeader(
  title = "IARP FBF Trigger dashboard",
  # Trick to put logo in the corner
  tags$li(div(
    class="logo_div",
    img(src = 'https://www.510.global/wp-content/uploads/2017/07/510-LOGO-WEBSITE-01.png',#'510logo.png',
        title = "logo", height = "44px")),
    class = "dropdown")
)

ui_tab_main <- tabItem(
  "tab_main",
  fluidRow(
    column(
      width = 12,
      leafletOutput("impact_map", height=600),
      h3(textOutput("selected_district"))
    )
  ),
  fluidRow(
    column(
      width = 2,
      # sliderInput("swi_threshold", "Select SWI Threshold: ", min=10, max = 100, value=75),
      uiOutput("rainfall_slider"),
      uiOutput("glofas_dropdown"),
      uiOutput("glofas_slider"),
      uiOutput("glofas_var_selector"),
      uiOutput("result_html")
    ),
    column(
      width = 10,
      plotlyOutput("rainfall_glofas_plot")
    )
  )
)

body <- dashboardBody(
  # Loads CSS and JS from www/custom.css in
  tags$head(tags$link(rel = "stylesheet",
                      type = "text/css", href = "custom_css.css")),
  tags$head(tags$script(src="main.js")),
  tabItems(
    ui_tab_main
  )
)

ui <- dashboardPage(
  header,
  dashboardSidebar(
    collapsed=F,
    sidebarMenu(
      menuItem("Main Tab", tabName = "tab_main"),
      dateRangeInput('dateRange',
                     label = 'Select date range:',
                     start = min(df_impact_raw[[1]]$date, na.rm=T), end = max(df_impact_raw[[1]]$date, na.rm=T)),
      
      radioButtons("country", "Country:", c("Ethiopia" = 1, "Kenya" = 2, "Uganda" = 3)),
      selectInput("Level", "Select Admin Level (only Kenya):", c("Sub county"=1, "Ward"=10),selected="level3")
      
    )
  ),
  body
)
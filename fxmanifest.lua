-- This resource is part of the default Cfx.re asset pack (cfx-server-data)
-- Altering or recreating for local use only is strongly discouraged.

version "1.0.0"

-- ui_page "dist/index.html"

client_script "./dist/client/*.js"
server_script "./dist/server/*"
shared_script "./dist/shared/*"
files {
    "assets/*"
}

fx_version "cerulean"
games {"gta5"}

dependencies {
    "yarn",
    "webpack"
}

webpack_config "webpack.config.js"

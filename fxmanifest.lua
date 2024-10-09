fx_version "cerulean"

version '1.0.0'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'

client_scripts {
  'client/client.lua',
  'client/utils.lua',
}

server_scripts {
  'server/server.lua',
}

files {
	'web/build/index.html',
	'web/build/**/*',
}

## Requirements

[Heroku cli](https://devcenter.heroku.com/articles/heroku-cli)

## Server

```bash
$ heroku create stathis-server --remote heroku-stathis-server

$ heroku buildpacks:add -a stathis-server heroku/nodejs
$ heroku buildpacks:add -a stathis-server heroku-community/multi-procfile

$ heroku config:set -a stathis-server PROCFILE=packages/server/Procfile
$ heroku config:set -a stathis-server HTTP_ORIGIN=https://stathis-client.herokuapp.com
$ heroku config:set -a stathis-server SOCKET_ORIGIN=https://stathis-client.herokuapp.com
```

heroku create stathis-client --remote heroku-stathis-client

## Heroku Multi Procfile buildpack

heroku buildpacks:add -a stathis-client heroku-community/multi-procfile
heroku buildpacks:add -a stathis-client mars/create-react-app

heroku config:set -a stathis-client PROCFILE=packages/client/Procfile
heroku config:set -a stathis-client JS_RUNTIME_TARGET_BUNDLE="/app/packages/client/build/static/js/\*.js"
heroku config:set -a stathis-client REACT_APP_HTTP_URL=https://stathis-server.herokuapp.com
heroku config:set -a stathis-client REACT_APP_SOCKET_URL=https://stathis-server.herokuapp.com

git push heroku-stathis-server HEAD:main

heroku --app heroku-stathis-server logs --tail

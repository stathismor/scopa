# Deployment

## Requirements

[Heroku cli](https://devcenter.heroku.com/articles/heroku-cli)

## Deploy

Clone the Heroku repo, if you haven't done so already:

```bash
$ heroku git:clone -a scopa-server
$ cd scopa-server
```

Make some changes to the code you just cloned and deploy them to Heroku using Git.

```bash
$ git add .
$ git commit -am "make it better"
$ git push heroku-scopa-server HEAD:main
```

## Logs

To check Heroku live logs, do:

```bash
heroku --app scopa-server logs --tail
```

## Setup

Below are described the steps taken to setup Scopa on Heroku.

### Server

```bash
$ heroku create scopa-server --remote heroku-scopa-server

$ heroku buildpacks:add -a scopa-server heroku/nodejs
$ heroku buildpacks:add -a scopa-server heroku-community/multi-procfile

$ heroku config:set -a scopa-server PROCFILE=packages/server/Procfile
$ heroku config:set -a scopa-server HTTP_ORIGIN=https://scopa-client.herokuapp.com
$ heroku config:set -a scopa-server SOCKET_ORIGIN=https://scopa-client.herokuapp.com
```

### Client

```bash
heroku create scopa-client --remote heroku-scopa-client

heroku buildpacks:add -a scopa-client heroku-community/multi-procfile
heroku buildpacks:add -a scopa-client mars/create-react-app

heroku config:set -a scopa-client PROCFILE=packages/client/Procfile
heroku config:set -a scopa-client JS_RUNTIME_TARGET_BUNDLE="/app/packages/client/build/static/js/\*.js"
heroku config:set -a scopa-client REACT_APP_HTTP_URL=https://scopa-server.herokuapp.com
heroku config:set -a scopa-client REACT_APP_SOCKET_URL=https://scopa-server.herokuapp.com
```

### Useful links

- https://medium.com/inato/how-to-setup-heroku-with-yarn-workspaces-d8eac0db0256
- https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-multi-procfile
- https://elements.heroku.com/buildpacks/mars/create-react-app-buildpack

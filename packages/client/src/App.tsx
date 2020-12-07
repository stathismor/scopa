import { Lobby } from 'pages/Lobby';
import { Game } from 'pages/Game';
import { UiDocs } from 'pages/UiDocs';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Lobby />
      </Route>
      <Route path="/game/:roomName">
        <Game />
      </Route>
      <Route path="/docs">
        <UiDocs />
      </Route>
    </Switch>
  );
}

export default App;

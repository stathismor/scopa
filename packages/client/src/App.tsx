import { Lobby } from 'pages/Lobby';
import { Game } from 'pages/Game';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Lobby />
      </Route>
      <Route path="/game/:gameId">
        <Game />
      </Route>
    </Switch>
  );
}

export default App;

import { Lobby } from 'pages/Lobby';
import { Room } from 'pages/Room';
import { UiDocs } from 'pages/UiDocs';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Lobby />
      </Route>
      <Route path="/game/:roomName">
        <Room />
      </Route>
      <Route path="/docs">
        <UiDocs />
      </Route>
    </Switch>
  );
}

export default App;

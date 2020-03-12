import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, useRouteMatch,
  useParams, Link, Redirect, useHistory, useLocation, RouteProps
} from 'react-router-dom'
import {Store, useStores} from '../models'
import { Provider, Observer } from 'mobx-react';

// 定义路由根路径
const basename = '/'

function App() {
  return (
    <Router basename={basename}>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>
      <Provider {...Store}>
        <Switch>
          <PrivateRoute path="/about">
            <Topics />
          </PrivateRoute>
          <Route path="/topics">
            <About />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        </Provider>
      </div>
    </Router>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb: () => void) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

interface Props extends RouteProps {
  children: React.ReactNode
}
function PrivateRoute({ children, ...rest }: Props) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

interface State {
  from: any
}
function LoginPage() {
  let history = useHistory();
  let location = useLocation<State>();
  const {globalState} = useStores()
  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    fakeAuth.authenticate(() => {
      history.replace(from);
    });
    globalState.setUserData({
      userID: 1,
      userName: '12'
    })
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function Topics() {
  let match = useRouteMatch();
  const {globalState} = useStores()
  return (
    <div>
      <h2>Topics</h2>
      <Observer>
          {() => <div>{globalState.userData?.userID}</div>}
      </Observer>
      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}

export default App;

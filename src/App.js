import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Edit from "./Components/EditTask/Edit";
import Create from "./Components/CreateTask/Create";
import Show from "./Components/ShowDetails/ShowDetails";
import SignIn from "./Components/SignIn/Signin";
import ShowList from "./Components/ShowList/ShowList";
import ls from "local-storage";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={SignIn} />
          <PrivateRoute path="/list" component={ShowList} />
          <PrivateRoute path="/edit/:id" component={Edit} />
          <PrivateRoute path="/create" component={Create} />
          <PrivateRoute path="/show/:id" component={Show} />
        </Switch>
      </div>
    </Router>
  );
}
export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      ls.get("UID") ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

export default App;

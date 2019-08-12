import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../FirebaseConfig/Firebase";
import ls from "local-storage";

export default class ShowList extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("Tasks");
    this.unsubscribe = null;
    this.state = {
      tasks: []
    };
  }

  componentDidMount() {
    console.log(ls.get("UID"));
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = querySnapshot => {
    const tasks = [];
    querySnapshot.forEach(doc => {
      if (doc.data().UID === ls.get("UID")) {
        const { title, status, image } = doc.data();
        tasks.push({
          key: doc.id,
          doc, // DocumentSnapshot
          title,
          status,
          image
        });
        this.setState({
          tasks
        });
      }
    });
    console.log(this.state.tasks);
  };

  initApp = () => {
    firebase
      .auth()
      .signOut()
      .then(
        function() {
          console.log("Signed Out");
        },
        function(error) {
          console.error("Sign Out Error", error);
        }
      );
    this.props.history.push("/");
    //localStorage.clear();
  };

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">TASKS LIST</h3>
            <button onClick={this.initApp}>Signout</button>
          </div>
          <div class="panel-body">
            <h4>
              <Link to="/create">Add Task</Link>
            </h4>
            <table class="table table-stripe">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tasks.map(task => (
                  <tr>
                    <td>
                      <Link to={`/show/${task.key}`}>{task.title}</Link>
                    </td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

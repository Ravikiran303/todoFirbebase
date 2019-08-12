import React, { Component } from "react";
import firebase from "../FirebaseConfig/Firebase";
import { Link } from "react-router-dom";
import "./ShowDetails.css";

class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {},
      key: ""
    };
  }

  componentDidMount = async () => {
    const ref = await firebase
      .firestore()
      .collection("Tasks")
      .doc(this.props.match.params.id);

    await ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          task: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  };

  delete = async id => {
    await firebase
      .firestore()
      .collection("Tasks")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        this.props.history.push("/list");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4>
              <Link to="/list">Task List</Link>
            </h4>
          </div>
          <div class="panel-body">
            <div className="details">
              <img src={this.state.task.image_url} alt="" />
              <div className="details_div">
                <span>Title : {this.state.task.title}</span>
                <br />
                <span>Status : {this.state.task.status}</span>
              </div>
            </div>
            <Link to={`/edit/${this.state.key}`} class="btn btn-success">
              Edit
            </Link>
            &nbsp;
            <button
              onClick={this.delete.bind(this, this.state.key)}
              class="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Show;

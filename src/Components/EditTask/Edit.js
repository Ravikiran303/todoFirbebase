import React, { Component } from "react";
import firebase from "../FirebaseConfig/Firebase";
import { Link } from "react-router-dom";

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      title: "",
      status: "",
      image: "",
      url: "",
      image_name: ""
    };
  }

  componentDidMount = async () => {
    const ref = await firebase
      .firestore()
      .collection("Tasks")
      .doc(this.props.match.params.id);

    await ref.get().then(doc => {
      if (doc.exists) {
        const task = doc.data();

        this.setState({
          key: doc.id,
          title: task.title,
          status: task.status,
          url: task.image_url,
          image_name: task.image_name
        });
      } else {
        console.log("No such document!");
      }
    });
  };

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState({ task: state });
  };

  onChangeImage = e => {
    this.setState({
      image: e.target.files[0]
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    await firebase
      .firestore()
      .collection("Tasks")
      .doc(this.props.match.params.id)
      .update({
        title: this.state.title,
        status: this.state.status
      });

    if (this.state.image.name) {
      const storage = firebase.storage();
      const updateImage = storage
        .ref(`images/${this.state.image.name}`)
        .put(this.state.image);

      updateImage.on(
        "state_changed",
        snapshot => {},
        err => {
          console.log(err);
        },
        async () => {
          await storage
            .ref("images")
            .child(this.state.image.name)
            .getDownloadURL()
            .then(url => {
              firebase
                .firestore()
                .collection("Tasks")
                .doc(this.props.match.params.id)
                .update({
                  image_url: url,
                  image_name: this.state.image.name
                });
            });
        }
      );
    }
    this.props.history.push("/list");
  };

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">EDIT TASK</h3>
          </div>
          <div class="panel-body">
            <h4>
              <Link to={`/show/${this.state.key}`} class="btn btn-primary">
                Show Details
              </Link>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Title:</label>
                <input
                  type="text"
                  class="form-control"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="status">Status:</label>
                <input
                  type="text"
                  class="form-control"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                />
              </div>
              <div class="form-group">
                <label>Image:{this.state.image_name}</label>
                <input
                  type="file"
                  accept="image/*"
                  class="form-control"
                  onChange={this.onChangeImage}
                />
              </div>
              <button type="submit" class="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;

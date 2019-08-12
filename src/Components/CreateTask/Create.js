import React, { Component } from "react";
import firebase from "../FirebaseConfig/Firebase";
import { Link } from "react-router-dom";
import "firebase/storage";
import ls from "local-storage";

class Create extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("Tasks");
    this.state = {
      title: "",
      status: "",
      image: "",
      url: "",
      isSubmitting: false,
      uid: ""
    };
  }
  componentDidMount = () => {
    const uid_ = ls.get("UID");
    this.setState({ uid: uid_ });
  };
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };
  onChangeImage = e => {
    this.setState({ image: e.target.files[0] });
  };

  onSubmit = e => {
    e.preventDefault();
    const storage = firebase.storage();
    this.setState({ isSubmitting: true });
    const UID = this.state.uid;
    const { title, status } = this.state;

    const uploadImage = storage
      .ref(`images/${this.state.image.name}`)
      .put(this.state.image);

    uploadImage.on(
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
            this.setState({ url: url }, () => {
              const image_url = this.state.url;
              const image_name = this.state.image.name;

              this.ref
                .add({ UID, title, status, image_url, image_name })
                .then(docRef => {
                  this.setState({
                    title: "",
                    status: "",
                    url: ""
                  });
                  this.props.history.push("/list");
                })
                .catch(error => {
                  console.error("Error adding document: ", error);
                });
            });
          });
      }
    );
  };

  renderLoading = () => {
    if (this.state.isSubmitting) {
      return (
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      );
    }
  };
  render() {
    const { title, status } = this.state;
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">ADD TASK</h3>
          </div>
          <div class="panel-body">
            <h4>
              <Link to="/list" class="btn btn-primary">
                Tasks List
              </Link>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Title:</label>
                <input
                  type="text"
                  class="form-control"
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div class="form-group">
                <label for="status">Status:</label>
                <input
                  class="form-control"
                  name="status"
                  onChange={this.onChange}
                  placeholder="Status"
                  value={status}
                />
              </div>
              <div class="form-group">
                <label for="image">Image:</label>
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
        {this.renderLoading()}
      </div>
    );
  }
}

export default Create;

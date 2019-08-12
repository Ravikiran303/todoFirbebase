import React, { Component } from "react";
import firebase from "../FirebaseConfig/Firebase";
import * as firebaseui from "firebaseui";
import { withRouter } from "react-router-dom";
import ls from "local-storage";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  }
  state = {
    UID: ""
  };
  getUiConfig = props => {
    var self = this;

    return {
      callbacks: {
        signInSuccess: function(user, credential, redirectUrl) {
          self.props.history.push("/list");

          return false;
        }
      },
      signInFlow: "popup",
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: "",
            size: "invisible",
            badge: ""
          },
          defaultCountry: "IN",
          defaultNationalNumber: "",
          loginHint: ""
        }
      ]
    };
  };

  handleSignedOutUser = () => {
    document.getElementById("user-signed-out").style.display = "block";
    this.ui.start("#firebaseui-container", this.getUiConfig());
  };

  componentDidMount() {
    let self = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        ls.set("UID", user.uid);
      } else {
        self.handleSignedOutUser();
      }
    });
  }

  render() {
    return (
      <div id="container">
        <div id="loaded" class="hidden">
          <div id="main">
            <div id="user-signed-out" class="hidden">
              <div id="firebaseui-spa">
                <div id="firebaseui-container" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Signin);

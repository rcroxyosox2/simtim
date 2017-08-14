import React from 'react';
import ReactDOM from 'react-dom';
import {LoginForm} from './components/Auth.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import sanitize from 'sanitize.scss/_sanitize.scss';
import Styles from './scss/app.scss';
import {
Switch,
HashRouter,
Route,
Link
} from 'react-router-dom'
import {init as firebaseInit} from './firebase.js';

const indexNode = document.getElementById("app");

// Find the DB schema here - http://jsoneditoronline.org/?id=30a6c3f65f1a1cca12909a801183b1d8

export default class Index extends React.Component {
    constructor(props) {

        super(props);
        const fire = this.fire = firebaseInit();
        const db = this.db = fire.database(); //the real-time database
        const auth = this.auth = fire.auth(); //the firebase auth namespace
        var user = auth.currentUser;

        this.state = {
            user: auth.currentUser,
            loading: true
        }

        this.auth.onAuthStateChanged((user) => {
            this.setState({user: user, loading: false});
            if (user) {
                // User is signed in.
                // console.log("onAuthStateChanged: user is logged in", user.providerData);
            } else {
                // No user is signed in.
                // console.log("onAuthStateChanged: user is logged out", user);
            }
        });


    }
    render() {

        // TODO: make generic
        const appLoadingState = <div>Laoding....</div>;

        let app = (
            <div className="Index">
                <Route exact path="/" component={Home}></Route>
                <Route exact path="/symptom" component={Home}></Route>
                <Route exact path="/symptom/list" component={Home}></Route>
                <Route path="/settings" render={()=><Settings num="2" auth={this.auth}/>}></Route>
            </div>
        )

        if (!this.state.user) {
            app = <div><LoginForm auth={this.auth} fire={this.fire} /></div>;
        }

        return (this.state.loading) ? appLoadingState : app;
    }
}

ReactDOM.render(
    <HashRouter basename="/">
        <Index />
    </HashRouter>, 
    indexNode
);
import React from 'react';
import ReactDOM from 'react-dom';
import {LoginForm} from './components/Auth.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import sanitize from 'sanitize.scss/_sanitize.scss';
import Styles from './scss/app.scss';
import {
Switch,
Redirect,
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
        var user = this.user = auth.currentUser;

        this.state = {
            user: auth.currentUser,
            loading: true
        }
    }

    componentDidMount() {
        this.auth.onAuthStateChanged((user) => {
            this.setState({user: user, loading: false});
            if (this.user) {
                // User is signed in.
                // console.log("onAuthStateChanged: user is logged in", user.providerData, user.currentUser);
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
                <Switch>
                    <Route exact path="/" render={
                        (props) => { return <Home fire={this.fire} {...props} />; }
                    }></Route>
                    <Route exact path="/symptom" render={
                        (props) => { return <Redirect to="/symptom/add" />; }
                    }></Route>
                    <Route exact path="/*/add" render={
                        (props) => {return <Home fire={this.fire} {...props} />; }
                    }></Route>
                    <Route exact path="/settings" render={
                        (props) => {return <Settings num="2" auth={this.auth} fire={this.fire} {...props} />; }
                    }></Route>
                </Switch>
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
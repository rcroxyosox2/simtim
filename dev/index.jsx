import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './components/Auth.jsx';
import Home from './components/Home.jsx';
import sanitize from 'sanitize.scss/_sanitize.scss';
import Styles from './scss/app.scss';
import {init as firebaseInit} from './firebase.js';

const app = document.getElementById("app");

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        const fb = firebaseInit();
        const db = fb.database(); //the real-time database
        const auth = fb.auth(); //the firebase auth namespace



        const email = "test1@test.com";
        const password = "thepwisthebest1!";

        // auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        //   var errorCode = error.code;
        //   var errorMessage = error.message;
        //   console.error(errorCode, errorMessage)
        // });

    }
    render() {
        return <div className="Index"><Auth form="login" /></div>
    }
}

ReactDOM.render(
    <Index />, 
    app
);
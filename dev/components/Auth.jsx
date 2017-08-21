import React from 'react';
import ReactDOM from 'react-dom';
import SplashScreen from './SplashScreen.jsx';
import Style from '../scss/Auth.scss';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { Link } from 'react-router-dom'

class EmailField extends React.Component{ 
    render(){
        return <input type="text" placeholder="Email" {...this.props} />;
    }
}

EmailField.defaultProps = {
    defaultValue: "robertkcox@gmail.com"
};

class PasswordField extends React.Component { 
    render() {
        return <input type="password" placeholder="Password" {...this.props} />;
    }
}

PasswordField.defaultProps = {
    defaultValue: "thepwisthebest1!"
};

class PasswordAgainField extends React.Component {
    render() {
        return <input type="password" placeholder="Password Again" />;
    }
}

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
        };
    }

    login(e) {

        const auth = this.props.auth;
        const email = ReactDOM.findDOMNode(this.emailField).value;
        const password = ReactDOM.findDOMNode(this.pwField).value;
        this.setState({loading: true});

        auth.setPersistence(this.props.fire.firebase_.auth.Auth.Persistence.SESSION)
        .then(() => {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.

            return auth.signInWithEmailAndPassword(email, password).catch(error => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                // console.error(errorCode, errorMessage);
                this.setState({error: errorMessage, loading: false});
            });
        })
        .catch(error => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            this.setState({error: errorMessage, loading: false});
        });

    }

    clearMessages(e){
        if (this.state.error) {
            this.setState({error: null});
        }
    }

    render() {

        const buttonDisabledState = (this.state.loading) ? true : false ;
        const errorMessage = <div className="errorMessage">{this.state.error}</div>

        return (
            <div className="Auth LoginForm">
                <div className="mainContent">
                    <div className="mainForm">
                        <div className="logo">simtim</div>
                        
                        <CSSTransitionGroup transitionName="errorMessage" 
                            className="transitioningContentErrorMessage"
                            component="div"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                        >
                            {this.state.error && errorMessage}
                        </CSSTransitionGroup>

                        <EmailField ref={ field => { this.emailField = field;}} onFocus={this.clearMessages.bind(this)} />
                        <PasswordField ref={field => {this.pwField = field} } onFocus={this.clearMessages.bind(this)} />
                        <button disabled={buttonDisabledState} ref={o => {this.x = o} } onClick={this.login.bind(this)}>Log In</button>
                        <div id="loginWrapper">
                            <Link to="/createLogin">Create a login</Link>
                        </div>
                    </div>
                </div>
                <SplashScreen />
            </div>
        );
    }
}

class CreateForm extends React.Component {
    render() {
        return (<div className="Auth CreateForm">
                {emailField.bind(this)}
                {passwordField.bind(this)}
                {passwordAgainField.bind(this)}
                <button onClick={this.login.bind(this)}>Create Login</button>
            </div>);
    } 
}

class ResetForm extends React.Component {
    render() {
        return (<div className="Auth ResetForm">
            Reset Form
        </div>);
    }
}

class LogoutLink extends React.Component {
    logOut(e) {
        const auth = this.props.auth;
    
        auth.signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
        });
    }
    render() {
        return (<a href="#" onClick={this.logOut.bind(this)}>Sign this user out</a>);
    }
}

export {LoginForm, CreateForm, ResetForm, LogoutLink };

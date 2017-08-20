import React from 'react';
import ReactDOM from 'react-dom';
import SplashScreen from './SplashScreen.jsx';
import Style from '../scss/Auth.scss';

class EmailField extends React.Component{ 
    render(){
        return <input type="text" placeholder="Email" defaultValue={this.props.defaultValue} />;
    }
}

EmailField.defaultProps = {
    defaultValue: "robertkcox@gmail.com"
};

class PasswordField extends React.Component { 
    render() {
        return <input type="password" placeholder="Password" defaultValue={this.props.defaultValue} />;
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
        this.state = {loading: false};
    }

    login(e) {

        const auth = this.props.auth;
        const email = ReactDOM.findDOMNode(this.emailField).value;
        const password = ReactDOM.findDOMNode(this.pwField).value;
        this.setState({loading: true});

        auth.setPersistence(this.props.fire.firebase_.auth.Auth.Persistence.SESSION)
        .then(function() {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return auth.signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                console.error(errorCode, errorMessage);
            });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        });

    }

    render() {

        const LoadingMessage = function(props) {
            const h1Style = {
              color: 'blue'
            };
            if (props.loading) {
                return <h1 style={h1Style}>Loading...</h1>;
            }
            else{
                return <h1 style={h1Style}>Login: </h1>;
            }
        }

        return (
            <div className="Auth LoginForm">
                <div className="mainContent">
                    <LoadingMessage loading={this.state.loading} />
                    <EmailField ref={ field => { this.emailField = field;}} />
                    <PasswordField ref={field => {this.pwField = field} } />
                    <button ref={o => {this.x = o} } onClick={this.login.bind(this)}>Log In</button>
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

// class AuthForms extends React.Component{

//     create() {
//         // const email = "test1@test.com";
//         // const password = "thepwisthebest1!";

//         // auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
//         //   var errorCode = error.code;
//         //   var errorMessage = error.message;
//         //   console.error(errorCode, errorMessage)
//         // });
//     }

//     sendForgot() {
//         const auth = this.props.auth;
//         auth.sendPasswordResetEmail(auth.currentUser.email).then(function() {
//           // Password reset confirmation sent. Ask user to check their email.
//           console.log("sent, check the email");
//         }).catch(function(error) {
//           // Error encountered while sending password reset code.
//           console.error("counldnt send", error);
//         });
//     }

//     sendData() {
//         const auth = this.props.auth;
//         const userId = auth.currentUser.uid;

//         // let dbAction = this.props.db.ref('users/' + new Date().getTime());
//         let dbAction = this.props.db.ref('/users/');

//         // dbAction.on('value', snap => {
//         //     console.log("changed: ", snap.val());
//         // });

//         // dbAction.push({
//         //     username: "there",
//         //     email: "there",
//         //     profile_picture : "everywhere"
//         // });

//         dbAction.orderByKey().equalTo(userId).once('value').then(snap => {
//             console.log("ordered", snap.val());
//         })

//     }

//     render(){

//         const emailField = <input type="text" ref={o => {this.emailField = o} } placeholder="Email" defaultValue="robertkcox@gmail.com" />
//         const passwordField = <input type="password" ref={o => {this.pwField = o} } placeholder="Password" defaultValue="thepwisthebest1!" />
//         const passwordAgainField = <input type="password" ref={o => {this.pwaField = o} } placeholder="Password Again" />

//         const LoginForm = (
//             <div className="Auth_LoginForm">
//                 {emailField}
//                 {passwordField}
//                 <button onClick={this.login.bind(this)}>Log In</button>
//             </div>
//         );

//         const CreateForm = (
//             <div className="Auth_LoginForm">
//                 {emailField}
//                 {passwordField}
//                 {passwordAgainField}
//                 <button onClick={this.login.bind(this)}>Create Login</button>
//             </div>
//         );

//         const ResetForm = (
//             <div className="Auth_ResetForm">
//                 Reset Form
//             </div>
//         );

//         const formMap = {"login": LoginForm, "create": CreateForm, "reset": ResetForm};

//         return (
//             <div className="Auth">
//                 {formMap[this.props.form]}
//                 <a href="#" onClick={this.signOut.bind(this)}>Sign this user out</a><br /><br />
//                 <a href="#" onClick={this.sendForgot.bind(this)}>I forgot the password</a><br /><br />
//                 <a href="#" onClick={this.sendData.bind(this)}>Send some data</a>
//             </div>
//         );
//     }
// }

export {LoginForm, CreateForm, ResetForm, LogoutLink };

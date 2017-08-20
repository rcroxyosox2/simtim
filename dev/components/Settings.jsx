import React from 'react';
import Style from '../scss/Settings.scss';
import {LogoutLink} from './Auth.jsx';
import Styles from '../scss/Settings.scss';

class Settings extends React.Component{

    render(){
        return (
            <div className="Settings">
                <LogoutLink auth={this.props.auth} />
            </div>
        );
    }
}

export default Settings;

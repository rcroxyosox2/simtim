import React from 'react';
import Style from '../scss/MainHeader.scss';
import { Link } from 'react-router-dom'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class MainHeader extends React.Component{
    render(){

        console.log(this.props);

        return (
            <div className="MainHeader">
                <div id="mainLogoContainer">
                    <a href="#">simtim</a>
                </div>
                <div  id="mainSettingsContainer">
                    <Link to="/settings"><hr /><hr /><hr /></Link>
                </div>
            </div>
        );
    }
}

export default MainHeader;

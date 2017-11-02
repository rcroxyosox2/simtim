import React from 'react';
import Style from '../scss/MainHeader.scss';
import { Link } from 'react-router-dom'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class MainHeader extends React.Component{
    render(){

        let LogoItem = (
            <div id="mainLogoContainer">
                <Link to="/">simtim</Link>
            </div>
        );

        let SettingsItem = (
            <div  id="mainSettingsContainer">
                <Link to="/settings">
                    <hr />
                    <hr />
                    <hr />
                </Link>
            </div>
        );

        let BackItem = (
            <div id="mainBackContainer">
                <Link to="/">Back</Link>
            </div>
        );

        let ModeItem = (
            <div id="mainCalendarModeToggle">
                <Link to="/chart">1</Link>
                <Link to="/chart">2</Link>
            </div>
        );

        const path = this.props.location.pathname;
        let [parent, subview] = path.substring(1).split("/"); 
        const onChart = (parent == "chart");

        return (
            <div className="MainHeader">
                <CSSTransitionGroup transitionName="MainHeaderItems" 
                    className="transitioningContentMainHeaderItems"
                    component="div"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                {!onChart && LogoItem}
                {!onChart && SettingsItem}
                </CSSTransitionGroup>
                <CSSTransitionGroup transitionName="MainHeaderChartItems" 
                    className="transitioningContentMainHeaderChartItems"
                    component="div"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                >
                {onChart && BackItem}
                {onChart && ModeItem}
                </CSSTransitionGroup>
            </div>
        );
    }
}

export default MainHeader;

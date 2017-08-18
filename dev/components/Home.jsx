import React from 'react';
import { Route, history } from 'react-router-dom'
import MainHeader from './MainHeader.jsx';
import LineGraph from './LineGraph.jsx';
import MainServiceItem from './MainServiceItem.jsx';
import SymptomList from './SymptomList.jsx';
import EventAdd from './EventAdd.jsx';
import SleepAdd from './SleepAdd.jsx';
import ExcerciseAdd from './ExcerciseAdd.jsx';
import BaseComponent from './BaseComponent.jsx';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Style from "../scss/Home.scss";

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {activeItem: null};
    }

    _handleKeyDown(e) {

        const ESCAPE_KEY = 27;

        switch( e.keyCode ) {
            case ESCAPE_KEY:
                this.props.history.push("/");
            break;
                default: 
            break;
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown.bind(this));
    }

    render(){

        const SUBVIEW_IN_MODE = "add";

        const services = [
            {"name": "symptom", subview: SymptomList},
            {"name": "event", subview: EventAdd},
            {"name": "sleep", subview: SleepAdd},
            {"name": "excercise", subview: ExcerciseAdd}
        ];

        const servicesHtml = services.map((item, index) => { 
            const path = this.props.location.pathname;
            let SubView;
            let [parent, subview] = path.substring(1).split("/"); 
            let itemIsActive = (parent == item.name && subview == SUBVIEW_IN_MODE);
            if (itemIsActive) {
                SubView = item.subview;
            }

            return (
                <MainServiceItem key={index+"_"+item.name} name={item.name} subview={subview} active={itemIsActive}>
                    <CSSTransitionGroup transitionName="services" 
                        className="transitioningContent"
                        component="div"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}
                    >
                        {SubView && <SubView {...this.props} />}
                    </CSSTransitionGroup>
                </MainServiceItem>
            );
        });

        return (
            <Route children={
                ({match}) => 
                    {
                        let [parent, subview] = match.url.substring(1).split("/"); 
                        let hasActiveItems = (subview == SUBVIEW_IN_MODE)
                        let className = `Home ${hasActiveItems && "open"}`

                        return (
                        <div className={className}>
                            {/*<BaseComponent message="I am the message" />*/}
                            <MainHeader />
                                <div id="mainContent">
                                    <LineGraph delayRedraw={!hasActiveItems} />
                                    {servicesHtml}
                                </div>
                        </div>
                        );
                    }
        } />
        );
    }
}

export default Home;

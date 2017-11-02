import React from 'react';
import ReactDOM from 'react-dom';
import { Route, history } from 'react-router-dom'
import MainHeader from './MainHeader.jsx';
import HomeLineGraph from './HomeLineGraph.jsx';
import MainServiceItem from './MainServiceItem.jsx';
import Symptom from './Symptom.jsx';
import EventAdd from './EventAdd.jsx';
import Sleep from './Sleep.jsx';
import ExcerciseAdd from './ExcerciseAdd.jsx';
import BaseComponent from './BaseComponent.jsx';
import HomeLineGraphToggleSettings from './HomeLineGraphToggleSettings.jsx';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Style from "../scss/Home.scss";

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {activeItem: null, filteredTimestamp: null};
    }

    listenScrollEvent(e) {
        let graph = this.homeLineGraph;
        let gh = (graph.offsetHeight/2);

        let scrollView = e.target;
        let scrollPerc = 1 - (scrollView.scrollTop / gh)
        this.homeLineGraph.style.opacity = scrollPerc;

        if(scrollPerc > 0.8) {
            this.homeLineGraph.style.zIndex = 3;
        }else{
            this.homeLineGraph.style.zIndex = 2;
        }

        // this.homeLineGraph.style.transform = `scale(${scrollPerc})`;
    }

    handleKeyDown(e) {

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
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    graphPointTouchStart(stamp) {
        this.setState({filteredTimestamp: stamp})
    }

    paddingAdusted(top) {
        let domElm = ReactDOM.findDOMNode(this.chartSubViewElm);
        domElm.style.top = `${top}px`;
    }

    componentWillReceiveProps() {
        this.setState({filteredTimestamp: null});
    }

    render(){

        const ADD_MODE = "add";
        const CHART_MODE = "chart";

        const services = [
            {"name": "symptom", subview: Symptom},
            {"name": "event", subview: EventAdd},
            {"name": "sleep", subview: Sleep},
            {"name": "excercise", subview: ExcerciseAdd}
        ];

        const servicesHtml = services.reverse().map((item, index) => { 
            const path = this.props.location.pathname;
            let SubView;
            let [parent, subview] = path.substring(1).split("/"); 
            let itemIsActive = (parent == item.name && subview == ADD_MODE);
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
                (match) => 
                    {
                        let [parent, subview] = match.location.pathname.substring(1).split("/"); 
                        
                        let inChartMode = (parent == CHART_MODE);
                        let modeMapClass = "";

                        // Add Mode
                        if (subview === ADD_MODE){
                            modeMapClass = ADD_MODE+"Mode";
                        }

                        // Chart Mode
                        else if(parent === CHART_MODE){
                            modeMapClass = CHART_MODE+"Mode";
                        }

                        let className = `Home ${modeMapClass}`

                        const ChartSubView = (parent === CHART_MODE) ? HomeLineGraphToggleSettings : null;

                        return (
                        <div className={className}>
                            {/*<BaseComponent message="I am the message" />*/}
                            <MainHeader {...this.props} />
                                <div id="mainContent">
                                    <div className="homeLineGraphBodyContainer">
                                        <CSSTransitionGroup transitionName="chart"
                                            onScroll={this.listenScrollEvent.bind(this)}
                                            className="transitioningContent" 
                                            component="div"
                                            transitionEnterTimeout={300}
                                            transitionLeaveTimeout={300}
                                        >
                                        {ChartSubView && <ChartSubView key="1" ref={(elm) => {this.chartSubViewElm = elm}} />}
                                        </CSSTransitionGroup>
                                    </div>
                                    <HomeLineGraph {...this.props} 
                                        ref={elm=>{this.homeLineGraph = ReactDOM.findDOMNode(elm)}} 
                                        graphPointTouchStart={this.graphPointTouchStart.bind(this)} 
                                        paddingAdusted={this.paddingAdusted.bind(this)}
                                        filteredTimestamp={this.state.filteredTimestamp} />
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

import React from 'react';
import Style from '../scss/HomeLineGraph.scss';
import LineGraph from './LineGraph.jsx';
import { Route } from 'react-router-dom'
import HomeGraphFilter from './HomeGraphFilter.jsx';
import moment from 'moment';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {GroupDataCreator, HomeGraphDataHelp} from './HomeGraphDataHelp.jsx';


class HomeLineGraph extends React.Component{

    click(e) {
        this.props.history.push("/chart");
    }

    onFilterChange(event, selectedValue, index) {
        this.setState({
            duration: selectedValue
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            duration: HomeGraphDataHelp.DEFAULT_DURATION,
            loading: true,
            symptoms: {},
            sleep: {},
            excercise: {}
        };
    }

    componentDidMount() {
        const db = this.props.fire.database();
        const auth = this.props.fire.auth();
        const weekAgo = moment().startOf('day').subtract(1, 'week').valueOf();
        const today = moment().endOf('day').valueOf();
        const userServices = db.ref('/u001');

        userServices.on('value', snap => {
            let symptoms = snap.child('symptoms').val();
            let sleep = snap.child('sleep').val();
            let excercise = snap.child('excercise').val();
            this.setState({symptoms: symptoms, sleep: sleep, excercise: symptoms});
        });
    }

    render(){

        let consolidatedSymptoms = new GroupDataCreator({
            dataName: "symptom",
            data: this.state.symptoms, 
            keyString: "severity",
        });

        let consolidatedSleep = new GroupDataCreator({
            dataName: "sleep",
            data: this.state.sleep, 
            keyString: "hours",
            normalizer: 8 // hours of sleep
        });

        let helper = new HomeGraphDataHelp({
            duration: this.state.duration,
            groupDataCreators: [
                consolidatedSymptoms, consolidatedSleep
            ]
        });

        let data = helper.getChartReadyData();

        const path = this.props.location.pathname;
        let SubView;
        let [parent, subview] = path.substring(1).split("/"); 
        if(parent == "chart") {
            SubView = <HomeGraphFilter onSelected={this.onFilterChange.bind(this)} />;
        }

        return (
            <div className="HomeLineGraph">
                    <CSSTransitionGroup transitionName="HomeGraphFilter" 
                        className="transitioningContentHomeGraphFilter"
                        component="div"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                    {SubView}
                    </CSSTransitionGroup>
                <LineGraph {...this.props} data={data} />
            </div>
        );
    }
}

export default HomeLineGraph;

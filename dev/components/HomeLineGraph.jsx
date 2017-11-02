import React from 'react';
import ReactDOM from 'react-dom';
import Style from '../scss/HomeLineGraph.scss';
import LineGraph from './LineGraph.jsx';
import { Route } from 'react-router-dom'
import HomeGraphFilter from './HomeGraphFilter.jsx';
import moment from 'moment';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {GroupDataCreator, HomeGraphDataHelp} from './HomeGraphDataHelp.jsx';
import ListItems from './ListItems.jsx';
import GROUP_DATA_TYPES from './GROUP_DATA_TYPES';

class HomeLineGraph extends React.Component{

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

    click(e) {
        this.props.history.push("/chart");
    }

    get isOnChart() {
        let path = this.props.location.pathname;
        let [parent, subview] = path.substring(1).split("/"); 
        return parent == "chart";
    }

    handleTouchStart(e) {
        const elm = e.target;
        this.selectedIndex = null;
        
        if(!this.isOnChart) {
            this.props.history.push("/chart");
        }

        else if(elm.dataset.timestamp) {
            if(elm.dataset.index) {
                this.selectedIndex = elm.dataset.index;
            }
            this.props.graphPointTouchStart && this.props.graphPointTouchStart(elm.dataset.timestamp);
        }
    }

    onFilterChange(event, selectedValue, index) {
        this.setState({
            duration: selectedValue
        });
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
            this.setState({
                symptoms: symptoms, sleep: sleep, excercise: symptoms
            });
        });
    }

    componentDidUpdate(){
        if(this.dataListContainerElm && this.homeGraphFilterElm) {
            // console.log(this.dataListContainerElm.offsetHeight);
            let elm = ReactDOM.findDOMNode(this.elm);
            let hgf = ReactDOM.findDOMNode(this.homeGraphFilterElm);
            let pt = (this.dataListContainerElm.offsetHeight - hgf.offsetHeight);
            
            let top = 0;

            if(!this.isOnChart) {
                top = 0;
            }
            else if (pt > 0) {
                top = pt;
            }

            elm.style.top = `${top}px`;
            this.props.paddingAdusted && this.props.paddingAdusted(top);
        }
    }


    render(){
    
        let consolidatedSymptoms = new GroupDataCreator({
            dataType: GROUP_DATA_TYPES.SYMPTOM,
            data: this.state.symptoms, 
            keyString: "severity",
        });

        let consolidatedSleep = new GroupDataCreator({
            dataType: GROUP_DATA_TYPES.SLEEP,
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

        let DataList;
        if(this.props.filteredTimestamp && this.isOnChart){
            var dataList = helper.getRawDataByDate((item)=>{
                let rawDate = parseInt(item.date);
                return moment(rawDate).isSame(parseInt(this.props.filteredTimestamp), helper.granularity);
            });
            DataList = () => {
                let rawDate = parseInt(this.props.filteredTimestamp);
                return (
                <div className="dataListContainer" ref={(elm) => { this.dataListContainerElm = elm }}>
                    <header>{moment(rawDate).format()}</header>
                    <ListItems items={dataList} />
                </div>
                );
            }
        }

        let Filter;
        let selectedIndex = this.selectedIndex;

        if(this.isOnChart) {
            Filter = <HomeGraphFilter onSelected={this.onFilterChange.bind(this)} duration={this.state.duration} ref={(elm) => {this.homeGraphFilterElm = elm}} />;
        }
        else {
            selectedIndex = null;
        }

        return (
            <div className="HomeLineGraph">
                    
                    <CSSTransitionGroup transitionName="HomeDataList" 
                        className="transitioningContentHomeDataList"
                        component="div"
                        transitionEnterTimeout={250}
                        transitionLeaveTimeout={250}
                    >
                    {DataList && <DataList /> }
                    </CSSTransitionGroup>

                    <CSSTransitionGroup transitionName="HomeGraphFilter" 
                        className="transitioningContentHomeGraphFilter"
                        component="div"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}
                    >
                    {Filter}
                    </CSSTransitionGroup>
                <LineGraph {...this.props} 
                data={data} 
                handleTouchStart={this.handleTouchStart.bind(this)} 
                selectedIndex={selectedIndex}
                ref={(elm) => {this.elm = elm}}/>
            </div>
        );
    }
}

export default HomeLineGraph;

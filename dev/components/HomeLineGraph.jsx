import React from 'react';
import Style from '../scss/HomeLineGraph.scss';
import LineGraph from './LineGraph.jsx';
import moment from 'moment';
import {getConsolidatedDataValuesByDate} from './Helpers.jsx';


class HomeLineGraph extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            symptoms: {}
        };
    }

    componentDidMount() {
        const db = this.props.fire.database();
        const auth = this.props.fire.auth();
        let symptomsRef = db.ref("/u001/symptoms").orderByChild('date'); // TODO: convert u001 to userid 
        symptomsRef.on('value', (snap) => {
            this.setState({loading: false, symptoms: snap});
        });  
    }

    render(){

        let symptoms = {};
        this.state.symptoms.forEach && this.state.symptoms.forEach(item => {
            symptoms[item.key] = item.val();
        });

        let consolidated = getConsolidatedDataValuesByDate({data: symptoms, keyString: "severity"});

        let labels = [];
        let data = [];

        consolidated.forEach(item => {
            labels.push(item.label);
            data.push(item.data);
        });

        return (
            <div className="HomeLineGraph">
                <LineGraph {...this.props} labels={labels} data={data} />
            </div>
        );
    }
}

export default HomeLineGraph;

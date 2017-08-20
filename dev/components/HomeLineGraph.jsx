import React from 'react';
import Style from '../scss/HomeLineGraph.scss';
import LineGraph from './LineGraph.jsx';
import moment from 'moment';

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
        let symptomsRef = db.ref("/u001/symptoms"); // TODO: convert u001 to userid 
        symptomsRef.on('value', (snap) => {
            this.setState({loading: false, symptoms: snap.val()});
        });  
    }

    render(){

        const symptoms = this.state.symptoms;
        let labels = [];
        let data = [];

        for(let id in symptoms) {
            let symptom = symptoms[id];
            labels.push(moment(symptom.date).format("MMM YY"));
            data.push(symptom.severity);
        }

        return (
            <div className="HomeLineGraph">
                <LineGraph {...this.props} labels={labels} data={data} />
            </div>
        );
    }
}

export default HomeLineGraph;

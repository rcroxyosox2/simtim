import React from 'react';
import Style from '../scss/SymptomList.scss';
import SearchField from './SearchField.jsx';
import moment from 'moment';

class SymptomListItem extends React.Component {
    render() {
        return (
            <div>
                <span>{moment(this.props.date).format("MM-DD-YYYY")} | {this.props.date} | {this.props.severity}</span>
            </div>
        );
    }
}

class SymptomList extends React.Component {

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
        let symptomsRef = db.ref("/u001/symptoms");  // TODO: convert u001 to userid 
        symptomsRef.on('value', (snap) => {
            this.setState({loading: false, symptoms: snap.val()});
        });  
    }

    render(){
        const loadingState = (<div>Loaading...</div>);
        const symptoms = this.state.symptoms;
        const symptomItems = Object.keys(symptoms).map((key)=>{
            let symptom = symptoms[key];
            return <SymptomListItem {...symptom} key={key} />;
        });

        const readyState = (
            <div>
                <SearchField />
                <ul>
                    {symptomItems}
                </ul> 
            </div>
        );
        const contents = (this.state.loading) ? loadingState : readyState;

        return (
            <div className="SymptomList">
                {contents}
            </div>
        );
    }

}

export default SymptomList;

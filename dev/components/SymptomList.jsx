import React from 'react';
import Style from '../scss/SymptomList.scss';
import SearchField from './SearchField.jsx';
import SymptomAdd from './SymptomAdd.jsx';

class SymptomListItem extends React.Component {
    render() {
        return (
            <div>
                <span>{this.props.name}</span>
                <span>graph</span>
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
        let symptomsRef = db.ref("/u001/symptoms");
        symptomsRef.on('value', (snap) => {
            this.setState({loading: false, symptoms: snap.val()});
        });  
    }

    render(){
        const loadingState = (<div>Loaading...</div>);
        const symptoms = this.state.symptoms;
        const symptomItems = Object.keys(symptoms).map((key)=>{
            let symptom = symptoms[key];
            return <SymptomListItem name={symptom.name} key={key} />;
        });
        const readyState = (
            <div>
                <SearchField />
                <ul>
                    {symptomItems}
                </ul> 
                <SymptomAdd {...this.props} />
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

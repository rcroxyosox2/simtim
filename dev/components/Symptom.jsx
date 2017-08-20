import React from 'react';
import SymptomList from './SymptomList.jsx';
import SymptomAdd from './SymptomAdd.jsx';

class Symptom extends React.Component{
    render(){
        return (
            <div className="Symptom">
                <SymptomList {...this.props} />
                <SymptomAdd {...this.props} />
            </div>
        );
    }
}

export default Symptom;

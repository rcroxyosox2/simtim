import React from 'react';
import Style from '../scss/SymptomAdd.scss';

class SymptomAdd extends React.Component{

    addSymptom(e) {
        const db = this.props.fire.database();
        const auth = this.props.fire.auth();
        const name = this.name.value;
        const date = this.date.value;
        const severity = this.severity.value;
        const notes = this.notes.value;

        db.ref("/u001/symptoms").push({name, date, severity, notes});
    }

    componentDidMount() {
        // TODO: potentially prepop the data from the selection on the screen prior
        const db = this.props.fire.database();
    }

    render(){
        return (
            <div className="SymptomAdd">
                <input type="text" placeholder="name" ref={name => this.name = name} />
                <input type="text" placeholder="date" ref={date => this.date = date} />
                <input type="text" placeholder="severity" ref={severity => this.severity = severity} />
                <textarea placeholder="notes" ref={notes => this.notes = notes} ></textarea>
                <button onClick={this.addSymptom.bind(this)}>Add to timeline</button>
            </div>
        );
    }
}



export default SymptomAdd;

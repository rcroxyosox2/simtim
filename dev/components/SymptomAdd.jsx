import React from 'react';
import Style from '../scss/SymptomAdd.scss';
import moment from 'moment';

class SymptomAdd extends React.Component{

    addSymptom(e) {
        const db = this.props.fire.database();
        const auth = this.props.fire.auth();
        const name = this.name.value;
        const date = moment(this.date.value, 'YYYY-MM-DD').valueOf();
        const severity = parseInt(this.severity.value);
        const note = this.note.value;
        const data = {name, date, severity, note};
        
        db.ref("/u001/symptoms").push(data);
    }

    componentDidMount() {
        // TODO: potentially prepop the data from the selection on the screen prior
        const db = this.props.fire.database();
    }

    render(){
        return (
            <div className="SymptomAdd">
                <input type="text" placeholder="name" ref={name => this.name = name} />
                <input type="date" placeholder="date" ref={date => this.date = date} />
                <input type="text" placeholder="severity" ref={severity => this.severity = severity} />
                <textarea placeholder="note" ref={note => this.note = note} ></textarea>
                <button onClick={this.addSymptom.bind(this)}>Add to timeline</button>
            </div>
        );
    }
}



export default SymptomAdd;

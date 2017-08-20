import React from 'react';
import moment from 'moment';

class SleepAdd extends React.Component{

    addSleep(e) {
        const db = this.props.fire.database();
        const auth = this.props.fire.auth();
        const hours = this.hours.value;
        const date = moment(this.date.value, 'YYYY-MM-DD').valueOf();
        const note = this.note.value;

        const data = {hours, date, note}
        
        db.ref("/u001/sleep").push(data);
    }

    render(){
        return (
            <div className="SleepAdd">
                <input type="text" placeholder="hours" ref={input => {this.hours = input}} />
                <input type="date" placeholder="date" ref={input => {this.date = input}} />
                <textarea placeholder="note" ref={input => {this.note = input}} />
                <button onClick={this.addSleep.bind(this)}>Save</button>
            </div>
        );
    }
}

export default SleepAdd;

import React from 'react';
import Style from '../scss/SleepList.scss';
import moment from 'moment';

class SleepListItem extends React.Component{
    render() {
        return (
            <div className="SleepListItem">
                {moment(this.props.date).format("ddd MMM DD")}
            </div>
        );
    }
}

class SleepList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sleep: {}
        };
    }

    componentDidMount() {
        const db = this.props.fire.database();
        const auth = this.props.fire.auth();
        let sleepRef = db.ref("/u001/sleep");  // TODO: convert u001 to userid 
        sleepRef.on('value', (snap) => {
            this.setState({loading: false, sleep: snap.val()});
        });  
    }

    render(){

        const sleep = this.state.sleep;

        const sleepItems = Object.keys(sleep).map((key)=>{
            let sleepItem = sleep[key];
            return <SleepListItem {...sleepItem} key={key} />;
        });

        return (
            <div className="SleepList">
                {sleepItems}
            </div>
        );
    }
}

export default SleepList;

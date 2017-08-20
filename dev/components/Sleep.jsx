import React from 'react';
import SleepAdd from './SleepAdd.jsx'
import SleepList from './SleepList.jsx'

class Sleep extends React.Component{
    render(){
        return (
            <div className="Sleep">
                <SleepList {...this.props} />
                <SleepAdd {...this.props} />
            </div>
        );
    }
}

export default Sleep;

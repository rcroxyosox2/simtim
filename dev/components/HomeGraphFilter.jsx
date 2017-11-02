import React from 'react';
import Style from '../scss/HomeGraphFilter.scss';
import {Button, ButtonGroup} from './ButtonGroup.jsx'
import {HomeGraphDataHelp} from './HomeGraphDataHelp.jsx';

class HomeGraphFilter extends React.Component{

    onSelected(e, selectedValue, i){
        this.props.onSelected && this.props.onSelected(e, selectedValue, i); 
    }

    render(){
        const userDurations = HomeGraphDataHelp.USER_DURATIONS;
        let buttons = [];
        let k = 0;
        for (let name in userDurations) {
            
            buttons.push(<Button default={userDurations[name] == this.props.duration} text={name} onSelected={this.onSelected.bind(this)} key={k} selectedValue={userDurations[name]} />);
            k++;
        }

        return (
            <div className="HomeGraphFilter">
                <ButtonGroup>
                    {buttons}
                </ButtonGroup>
            </div>
        );
    }
}

export default HomeGraphFilter;

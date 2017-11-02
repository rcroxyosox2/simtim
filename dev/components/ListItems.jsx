import React from 'react';
import Style from '../scss/ListItems.scss';
import GROUP_DATA_TYPES from "./GROUP_DATA_TYPES";
import moment from 'moment';

class ListItem extends React.Component{
    render() {

        let rawDate = parseInt(this.props.date);
        let dateFormatted = moment(rawDate).format('MM/DD/YY h:ma');

        let mainLabel = "";

        if(this.props.dataType == GROUP_DATA_TYPES.SLEEP){
            mainLabel = `Slept for ${parseInt(this.props.hours)} hrs`;
        }
        else{
            mainLabel = this.props.name;
        }

        return (
            <li className={`${this.props.dataType}`}>
                <span>{dateFormatted}</span>
                <span>{mainLabel}</span>
            </li>
            );
    }
}

class ListItems extends React.Component{
    render() {

        if(!this.props.items) {
            console.warn("No props.items passed to ListItems");
            return false;
        }
        let listItems = this.props.items.map(item=><ListItem {...item} />)

        return (
            <ul className="ListItems">{listItems}</ul>
        );
    }
}

export default ListItems;

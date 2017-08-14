import React from 'react';
import Style from '../scss/MainServiceItem.scss';

class MainServiceItem extends React.Component{
    render(){

        const itemClassName = "item_" + this.props.name.toLowerCase();

        return (
            <div className={"MainServiceItem " + itemClassName}>{this.props.name} {this.props.children}</div>
        );
    }
}

export default MainServiceItem;

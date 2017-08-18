import React from 'react';
import Style from '../scss/MainServiceItem.scss';
import { Route, NavLink } from 'react-router-dom'

class MainServiceItem extends React.Component{
    render(){

        const itemClassName = "item_" + this.props.name.toLowerCase();
        const pathFrom = `/${this.props.name}/${this.props.subview}`;

        return (
            <Route path={pathFrom} children={(s) => { 

                    const className = "MainServiceItem " 
                        + itemClassName 
                        + (this.props.active ? " active" : " " ) 
                        + (this.props.hidden ? " hidden" : " " ) 

                    const linkTo = (this.props.active) ? `/` : `/${this.props.name}/add`

                    return (
                        <div className={className}>
                            <NavLink to={linkTo}>{this.props.name}</NavLink>
                            {this.props.children}
                        </div> 
                    );
                }
            } />
        );
    }
}

export default MainServiceItem;

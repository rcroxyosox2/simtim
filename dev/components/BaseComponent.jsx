import React from 'react';
import HOC from './HOC.jsx';

class BaseComponent extends React.Component{
    render(){
        return (
            <div className="BaseComponent">{this.props.message} {this.props.anotherMessage}</div>
        );
    }
}

export default HOC(BaseComponent);

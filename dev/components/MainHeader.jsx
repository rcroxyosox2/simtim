import React from 'react';
import Style from '../scss/MainHeader.scss';

class MainHeader extends React.Component{
    render(){
        return (
            <div className="MainHeader">
                <div><a href="#">simtim</a></div>
                <div><a href="#"><hr /><hr /><hr /></a></div>
            </div>
        );
    }
}

export default MainHeader;

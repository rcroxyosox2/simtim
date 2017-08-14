import React from 'react';
import Style from '../scss/MainHeader.scss';
import { Link } from 'react-router-dom'

class MainHeader extends React.Component{
    render(){
        return (
            <div className="MainHeader">
                <div><a href="#">simtim</a></div>
                <div>
                    <Link to="/settings"><hr /><hr /><hr /></Link>
                </div>
            </div>
        );
    }
}

export default MainHeader;

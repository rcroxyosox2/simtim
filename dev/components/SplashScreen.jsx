import React from 'react';
import Style from '../scss/SplashScreen.scss';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';



class SplashScreen extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 100);
    }

    render(){

        const loadedClass = (this.state.loaded) ? "loaded" : "" 

        return (
            <div className={`SplashScreen ${loadedClass}`}>

                <div className="mountainContainer">
                    <div>
                        Track your symptoms, <br />
                        find the road to recovery
                    </div>
                </div>
                <div id="clouds1"></div> 
                <div id="clouds2"></div> 
            </div>
        );
    }
}

export default SplashScreen;

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
        
        const animationTime = 60000;

        this.timeout = setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 100);

        // this.interval1 = setInterval(() => {
        //     this.setState({
        //         loaded: false
        //     });

        // }, animationTime);

        // this.interval2 = setInterval(() => {
        //     this.setState({
        //         loaded: true
        //     });
        // }, animationTime * 2);
    }

    componentWillUnmount() {
        // clearInterval(this.interval1);
        // clearInterval(this.interval2);
        clearTimeout(this.timeout);
    }

    render(){

        const loadedClass = (this.state.loaded) ? "loaded" : "" 

        return (
            <div className={`SplashScreen ${loadedClass}`}>

                <div className="mountainContainer"></div>
                <div className="cloudBlur"></div>
                <div className="clouds1"></div> 
                <div className="clouds2"></div> 
                <div id="tagLine">
                    Track your symptoms, <br />
                    find the road to recovery
                </div>
            </div>
        );
    }
}

export default SplashScreen;

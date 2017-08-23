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

    getStars(n) {
        let items = [];

        for(let i = 0; i < n; i++) {
            let s = Math.floor(Math.random() * 4) + 2;
            let style = {
                width: s,
                height: s,
                borderRadius: s/2
            };
            items.push(<div className="star" style={style} key={i+"star"}></div>);
        }
        return <div className="stars">{items}</div>;
    }

    componentDidMount() {
        
        const animationTime = 60000;

        this.timeout = setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 100);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render(){

        const loadedClass = (this.state.loaded) ? "loaded" : "" 

        return (
            <div className={`SplashScreen ${loadedClass}`}>

                <div className="mountainContainer"></div>
                <div className="cloudBlur"></div>
                <div className="cloudBlur2"></div>
                <div className="clouds1"></div> 
                <div className="clouds2"></div> 
                <div className="nightSky"></div>
                <div className="moon"></div> 
                {this.getStars(18)}
                <div className="squiggle"></div> 
                <div id="tagLine">
                    Track your symptoms, <br />
                    find the road to recovery
                </div>
            </div>
        );
    }
}

export default SplashScreen;

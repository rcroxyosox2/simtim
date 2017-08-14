import React from 'react';
import MainHeader from './MainHeader.jsx';
import LineGraph from './LineGraph.jsx';
import MainServiceItem from './MainServiceItem.jsx';
import SymptomList from './SymptomList.jsx';
import { Link } from 'react-router-dom'

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {activeItem: null};
    }

    render(){

        console.log(this.props);


        const subViews = {
            'symptom' : {
                'list': SymptomList
            }
        };

        const services = [
            {"name": "symptom", "link": "/symptom/list"},
            {"name": "event", "link": "/addevent"},
            {"name": "sleep", "link": "/addsleep"},
            {"name": "excercise", "link": "/addexcercise"}
        ];

        const servicesHtml = services.map((item, index) => { 

            let SubView;
            let [parent, subview] = this.props.location.pathname.substring(1).split("/");            
            
            if(parent == item.name) {
                if(parent && !subview && subViews[parent] && Object.keys(subViews[parent])) {
                    SubView = subViews[parent][Object.keys(subViews[parent])[0]];
                }
                else if(parent && subview){
                    SubView = subViews[parent][subview];
                }
            }

            return (
                <Link to={item.link} key={index+"_item.name"}>
                    <MainServiceItem name={item.name}>
                        {SubView && <SubView />}
                    </MainServiceItem>
                </Link>
            );
        });

        return (
            <div className="Home">
                <MainHeader />
                <LineGraph />
                {servicesHtml}
            </div>
        );
    }
}

export default Home;

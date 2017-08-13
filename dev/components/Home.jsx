import React from 'react';
import MainHeader from './MainHeader.jsx';
import LineGraph from './LineGraph.jsx';
import MainServiceItem from './MainServiceItem.jsx';

class Home extends React.Component{
    render(){

        const services = [
            {"name": "Symptom", "link": ""},
            {"name": "Event", "link": ""},
            {"name": "Sleep", "link": ""},
            {"name": "Excercise", "link": ""}
        ];

        const servicesHtml = services.map((item, index) => <MainServiceItem key={index+"_item.name"} name={item.name} link={item.link} />)

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

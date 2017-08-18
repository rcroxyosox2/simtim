import React from 'react';
import Style from '../scss/LineGraph.scss';
import ChartistGraph from 'react-chartist';

class LineGraph extends React.Component{

    render(){

        if (this.props.delayRedraw) {

            let interval;

            window.setTimeout(() => {
                window.clearInterval(interval);
            }, 600);

            interval = setInterval(() => {
                var evt = new UIEvent('resize'); 
                window.dispatchEvent(evt);
                console.log("going");
            }, 10);
        }

        const data = {
            labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
            series: [
                [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
            ]
        };

        const options = {
            high: 10,
            low: -10,
            fullWidth: true,
            showLabel: false,
            showPoint: false,
            chartPadding:{
                top: 0,
                right: 5,
                bottom: 0,
                left: -34
            },
            axisY: {
                showGrid: false,
                showLabel: false
            },
            axisX: {
                showGrid: false,
                labelInterpolationFnc: function(value, index) {
                    return index % 2 === 0 ? value : null;
                }
            }
        };

        const type = 'Line'

        const listener = {
            draw: (data) => {
                // console.log(data.type);

                // remove the dots
                // if (data.type == "point"){
                //     data.element.attr({
                //         style: 'stroke-width: 0;'
                //     });
                // }
            }
        };

        return (
            <div className="LineGraph" onClick={o => this.click.bind(this)}>
                <ChartistGraph data={data} options={options} type={type} listener={listener} ref={chart => this.chart = chart} />
            </div>
        );
    }
}

export default LineGraph;

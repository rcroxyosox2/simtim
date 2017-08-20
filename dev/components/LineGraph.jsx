import React from 'react';
import Style from '../scss/LineGraph.scss';
import ChartistGraph from 'react-chartist';


class LineGraph extends React.Component{

    click(e) {
        this.props.history.push("/chart");
    }

    render(){

        const MAIN_MARGINS = 45;

        if (this.props.delayRedraw) {

            let interval;

            window.setTimeout(() => {
                window.clearInterval(interval);
            }, 600);

            interval = setInterval(() => {
                var evt = new UIEvent('resize'); 
                window.dispatchEvent(evt);
            }, 10);
        }


        const data = {
            labels: this.props.labels,
            series: [ this.props.data ]
        };

        const options = {
            // high: 10,
            // low: -10,
            fullWidth: true,
            showPoint: false,
            chartPadding:{
                top: MAIN_MARGINS / 2,
                right: (5 + MAIN_MARGINS),
                bottom: MAIN_MARGINS + 5,
                left: (MAIN_MARGINS)
            },
            axisY: {
                showGrid: false,
                showLabel: false,
                offset: 0
            },
            axisX: {
                stretch: 'middle',
                showGrid: false,
                labelOffset: {
                    y: 20
                }
                // labelInterpolationFnc: function(value, index) {
                //     return index % 2 === 0 ? value : null;
                // }
            }
        };

        const type = 'Line'
        let bigW;
        const listener = {
            draw: (data) => {
                // If the draw event was triggered from drawing a point on the line chart
                if(data.type === 'label') {
                    if (data.width > bigW) {
                        bigW = data.width;
                    }

                    let newW = (bigW) ? bigW : data.width;
                    data.element.attr({ width: newW });
                    data.element.getNode().firstChild.style.width = `${newW}px`;
                    bigW = data.width;
                }
            }
        };

        const className = `LineGraph ${this.props.className}`
        return (
            <div className={className} onClick={this.click.bind(this)}>
                <ChartistGraph data={data} options={options} type={type} listener={listener} ref={chart => this.chart = chart} />
            </div>
        );
    }
}

LineGraph.defaultProps = {
    className: ""
}

export default LineGraph;

import React from 'react';
import Style from '../scss/LineGraph.scss';
import ChartistGraph from 'react-chartist';
import chartist from 'chartist';
import ArrayHelp from './ArrayHelp.jsx';


class LineGraph extends React.Component{

    handleTouchend(e) {
        let elm = e.target;
        elm.classList.remove('blink');
    }

    // TODO: needs to be tap
    handleTouchstart(e) {
        let elm = e.target;

        elm.classList.add('blink');
        this.props.handleTouchStart && this.props.handleTouchStart(e);
    }

    componentDidUpdate() {
        this.selectedIndex = null;
    }

    componentWillUnmount() {
        this.svg.removeEventListener("touchstart", this.handleTouchstart.bind(this));
    }

    render(){
        const MAIN_MARGINS = 45;

        const data = this.props.data; 

        const options = {
            fullWidth: (data.labels.length < 5),
            showPoint: true,
            lineSmooth: chartist.Interpolation.simple({
                divisor: 2,
                fillHoles: true,
            }),
            chartPadding:{
                top: MAIN_MARGINS / 2,
                right: (5 + MAIN_MARGINS),
                bottom: MAIN_MARGINS + 5,
                left: (MAIN_MARGINS)
            },
            axisY: {
                referenceValue: 1,
                showGrid: false,
                showLabel: false,
                offset: 0
            },
            axisX: {
                // type: chartist.FixedScaleAxis,
                showGrid: true,
                stretch: false,
                labelOffset: {
                    y: 20
                },
                labelInterpolationFnc: function(value, i, label){
                    let f = 8; // Charactor with of the font
                    let nl = label.length; // console.log(nl, i, " % 4", i % 4);
                    let c = label[i].length; // length of the string
                    let w = window.innerWidth; // size of the window (should be size of the graph but whatevs)
                    let s  = parseInt(w / (f*c)); // how many can fit in the window
                    let m = parseInt(label.length / s) // get a modulus
                    let ml = 2; // but make sure its not too small

                    if(data.labels.length < 4) {
                        return value;
                    }

                    return ((i % Math.max(m,ml) == 0)) ? value : null;
                    // return value;
                }
            }
        };

        const type = 'Line'
        let bigW;
        const listener = {
            created: (context) => {
                this.props.created && this.props.created(context);
                
                // Add an event listener                    
                this.svg = context.svg.getNode();
                this.svg.addEventListener('touchstart', this.handleTouchstart.bind(this));
                this.svg.addEventListener('touchend', this.handleTouchend.bind(this));

                if (ArrayHelp.pluck(this.props.data.series, "className", "sleep").length == 0) {
                    return;
                }

                let targetLine = {
                    value: 1,
                    class: 'ct-sleep-target-line'
                };

                let projectY = function(chartRect, bounds, value) {
                    return chartRect.y1 - (chartRect.height() / bounds.max * value);
                }

                var targetLineY = projectY(context.chartRect, context.bounds, targetLine.value);

                context.svg.elem('line', {
                    x1: context.chartRect.x1,
                    x2: context.chartRect.x2,
                    y1: targetLineY,
                    y2: targetLineY
                }, targetLine.class);

            },
            draw: (data) => {
                // If the draw event was triggered from drawing a point on the line chart

                this.props.draw && this.props.draw(context);

                if(data.type === 'point'){

                    const parentSVG = data.element.parent().root().getNode();
                    const outerW = parentSVG.clientWidth;
                    const outerH = parentSVG.clientHeight;
                    const w = (data.element.parent().root().getNode().clientWidth - (options.chartPadding.left * 2)) / this.props.data.labels.length;
                    const timeStamp = this.props.data.labelDateStamps[data.index];

                    let s = new chartist.Svg('rect', {
                        'x': (data.x - (w/2)),
                        'y': 0,
                        'fill': 'transparent',
                        // 'stroke': 'red',
                        // 'stroke-width': 1,
                        width: w,
                        height: outerH,
                        'data-timestamp': timeStamp,
                        'data-index': data.index,
                        'class': 'clickablePointTarget'
                    });

                    s.getNode().style.marginLeft = 20;
                    data.element.parent().append(s)

                    let ly2 = outerH;

                    if(options.chartPadding && options.chartPadding.bottom) { 
                        ly2 -= options.chartPadding.bottom;
                    }

                    if(options.axisX && options.axisX.labelOffset) {
                        ly2 -= options.axisX.labelOffset.y;
                    }
                    

                    let lc = ['linePopover'];

                    let l = new chartist.Svg('line', {
                        'x1': (data.x),
                        'x2': (data.x),
                        'y1': 0,
                        'y2': ly2,
                        'stroke-width': 1,
                        'data-index': data.index,
                        'class': lc.join(" ")
                    })

                    data.element.parent().append(l);

                    if(this.props.selectedIndex && this.props.selectedIndex == data.index){
                        setTimeout(() => {
                            l.getNode().classList.add('in');
                        }, 100);
                    }

                }

                if(data.type === 'label') {
                    if (data.width > bigW) {
                        bigW = data.width;
                    }
                    let span = data.element.getNode().firstChild;
                    let f = 10; // Charactor with of the font
                    let c = span.innerText.length; // length of the string
                    let calcW = (f*8);
                    let ll = this.props.data.labels.length;
                    let onLast = (data.index === ll-1);
                    let onFirst = (data.index === 0);
                    let newW = calcW; //(bigW) ? bigW : data.width;
                    data.element.attr({ 
                        width: newW 
                    });

                    span.style.width = `${newW}px`;
                    if(ll < 4) {
                        if(onLast && ll > 1){
                            span.style.textAlign = "right";
                            span.style.marginLeft = "-"+newW+"px";
                        }
                        else if(onFirst && ll > 1){
                            span.style.textAlign = "left";
                            span.style.marginLeft = 0;
                        }
                    }
                    else if(2 % ll == 0) {
                        span.style.marginLeft = "-50%";
                        span.style.textAlign = "center";
                    }


                    bigW = data.width;
                }
            }
        };

        const className = `LineGraph ${this.props.className}`
        return (
            <div className={className}>
                <ChartistGraph data={data} options={options} type={type} listener={listener} ref={chart => this.chart = chart} />
            </div>
        );
    }
}

LineGraph.defaultProps = {
    className: ""
}

export default LineGraph;

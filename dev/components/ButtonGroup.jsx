import React from 'react';
import Style from '../scss/ButtonGroup.scss';


class Button extends React.Component{
    test(e) {
        this.props.parent.setState({selected: this.props.k});
        this.props.onSelected(e, this.props.selectedValue, this.props.k);
    }
    componentWillMount() {
        if(this.props.default && !this.props.parent.selected) {
            this.props.parent.setState({selected: this.props.k});
        }
    }
    render() {
        let s = (this.props.selected) ? "selected" : "";
        return <button onClick={this.test.bind(this)} className={`Button ${s}`} data-key={this.props.k}>{this.props.text}</button>
    }
}

class ButtonGroup extends React.Component{
    constructor(props) {
        super(props);
        this.state = {selected: null} // should be an index
    }
    render(){
        let titles = this.props.titles;
        const childrenWithProps = React.Children.map(this.props.children, (child, i) => {
            let p = {parent: this, k: i};
            if(this.state.selected != null && i == this.state.selected) {
                p.selected = true;
            }
            return React.cloneElement(child, p)
        });
        return (
            <div className="ButtonGroup">
                <div className="buttonGroupContainer">
                    {childrenWithProps}
                </div>
            </div>
        );
    }
}

export {Button, ButtonGroup};

import React from 'react';

const HOC = (Base) => {
    return class HOC extends React.Component {
        render() {

            const myProps = {anotherMessage: ", This is something else"};

            return <Base {...this.props} {...myProps} />;
        }
    }
}

export default HOC;

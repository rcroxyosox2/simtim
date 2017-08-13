import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home.jsx';
import sanitize from 'sanitize.scss/_sanitize.scss';
import Styles from './scss/app.scss';

const app = document.getElementById("app");

ReactDOM.render(
    <Home/>, 
    app
);
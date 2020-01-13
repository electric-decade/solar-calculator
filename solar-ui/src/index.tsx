import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DailyUsageChart from './DailyUsageChart';
import VecUploadForm from './VecUploadForm';
import * as serviceWorker from './serviceWorker';
import {CalculatorData} from './Common';

var data:CalculatorData = { consumption:[], generation:[]} 

//ReactDOM.render(<VecUploadForm vecData={data} />, document.getElementById('form'));
ReactDOM.render(<App  />, document.getElementById('form'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

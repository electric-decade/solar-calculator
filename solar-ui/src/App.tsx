import React from 'react';
import logo from './logo.svg';
import './App.css';
import { CalculatorData} from './Common';
import VecUploadForm from './VecUploadForm';
import DailyUsageChart from './DailyUsageChart';
import ConsumptionHistogramChart from './ConsumptionHistogram';
import TimeOfUsageChart from './TimeOfUsageChart';

//const App: React.FC = () => {
class App extends React.Component {

  private data:CalculatorData = { consumption:[], generation:[]}
  private usageChart = React.createRef<DailyUsageChart>();
  private usageHistogram = React.createRef<ConsumptionHistogramChart>();
  private timeOfUsage = React.createRef<TimeOfUsageChart>();

  constructor(props:any) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(data:CalculatorData) {
    console.log( "app update");
    console.log( this);
    this.usageChart.current!.forceUpdate();
    this.usageHistogram.current!.forceUpdate();
    this.timeOfUsage.current!.forceUpdate();
    console.log( "update");
  }

  render( ) {
    return (
      <div className="App">
        <div><VecUploadForm vecData={this.data} update={this.update} /></div>
        <div><DailyUsageChart vecData={this.data} ref={this.usageChart} /></div>
        <div><ConsumptionHistogramChart vecData={this.data} ref={this.usageHistogram} /></div>
        <div><TimeOfUsageChart vecData={this.data} ref={this.timeOfUsage} /></div>
      </div>
    );

  }
}

export default App;

import React from 'react';
import './App.css';
import { CalculatorData} from './Common';
import VecUploadForm from './VecUploadForm';
import DailyUsageChart from './DailyUsageChart';
import ConsumptionHistogramChart from './ConsumptionHistogram';
import TimeOfUsageChart from './TimeOfUsageChart';
import DailySolarChart from './DailySolarChart';
import ImportHistogram from './ImportHistogram';
import DailyBatteryChart from './DailyBatteryChart';

//const App: React.FC = () => {
class App extends React.Component {

  private data:CalculatorData = { consumption:[], generation:[]}
  private usageChart = React.createRef<DailyUsageChart>();
  private usageHistogram = React.createRef<ConsumptionHistogramChart>();
  //private timeOfUsage = React.createRef<TimeOfUsageChart>();
  private dailySolarChart = React.createRef<DailySolarChart>();
  private importHistogram = React.createRef<ImportHistogram>();
  private dailyBatteryChart = React.createRef<DailyBatteryChart>();

  constructor(props:any) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(data:CalculatorData) {
    this.usageChart.current!.forceUpdate();
    this.usageHistogram.current!.forceUpdate();
    //this.timeOfUsage.current!.forceUpdate();
    this.dailySolarChart.current!.forceUpdate();
    this.importHistogram.current!.forceUpdate();
    this.dailyBatteryChart.current!.forceUpdate();
  }

  // <div><TimeOfUsageChart vecData={this.data} ref={this.timeOfUsage} /></div>
  render( ) {
    return (
      <div className="App">
        <div><VecUploadForm vecData={this.data} update={this.update} /></div>
        <div><DailyUsageChart vecData={this.data} ref={this.usageChart} /></div>
        <div><ConsumptionHistogramChart vecData={this.data} ref={this.usageHistogram} /></div>
        
        <div>
          <div><DailySolarChart vecData={this.data} ref={this.dailySolarChart} /></div>
          <div><ImportHistogram vecData={this.data} ref={this.importHistogram} /></div>
        </div>
        <div><DailyBatteryChart vecData={this.data} ref={this.dailyBatteryChart} /></div>
      </div>
    );

  }
}

export default App;

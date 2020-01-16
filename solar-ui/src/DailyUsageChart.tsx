import React, { Component } from 'react';
import moment from 'moment'
import {
    BarChart,
    Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { CalculatorData } from './Common';


type DailyUsageProps = {
    vecData: CalculatorData
}

type DailyUsageState = {
    dailyCharge: number;
    importCost: number;
    cost: number;
}

export default class DailyUsageChart extends Component<DailyUsageProps, DailyUsageState> {

    static defaultProps = {
        data: []
    }

    state: DailyUsageState;

    constructor(props: DailyUsageProps) {
        super(props)
        this.state = {dailyCharge: 0.9236, importCost: 0.23272,  cost: 0};
    }


    prepareData() {
        var x:number = 0;
        var data = [];

        if (this.props.vecData.consumption.length > 0) {

            
            var consumption = this.props.vecData.consumption;
            var cost = 0;
            for (x=0; x < consumption.length; x++) {
                var day = new Date();
                day.setFullYear(consumption[x].date[0],consumption[x].date[1]-1,consumption[x].date[2]-1);
                day.setHours(0);
                day.setMinutes(0);
                day.setSeconds(0);
                data.push( { time: day.getTime(), value: consumption[x].sum.toFixed(2)} );

                cost+= this.state.dailyCharge;
                cost+= (this.state.importCost * consumption[x].sum);
            }

            this.state.cost = Math.floor(cost); 
            console.log("Total cost: " + cost);

        } else {

            var startDate = new Date();
            startDate.setFullYear(2019,0,0);
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMinutes(0);

            for (x=0; x<365; x++) {
                
                data.push( { time: (startDate.getTime()+(x*86400*1000)), value:0} );
            }
        }

        return data;
    }

    render() {
        return (
            
            <div className="daily-chart">
                <hr/>
                <h2>Consumption chart</h2>
                <p>This is the base case chart. It shows daily consumption for the period of data provided. An estimated total energy cost over the period is provided.
                    This can be used as a comparison against solar and solar with battery charts.
                </p>
            <ResponsiveContainer width = '95%' height = {300}  >
                <BarChart width={400} height={400} data={this.prepareData()}  margin={{top: 5, right: 5, left: 30, bottom: 5}} >
                    <XAxis dataKey="time"
                    domain = {['auto', 'auto']}
                    tickFormatter = {(unixTime) => moment(unixTime).format('MMM YYYY')}
                    name = 'Time'
                    minTickGap= {100}
                    />
                    <YAxis unit=" kwh"/>
                    <Tooltip labelFormatter={t => moment(t).format('DD MMM YYYY')} />
                    <Bar  dataKey="value" stroke="#8884d8" stackId="a" unit=" kwh"  />
                </BarChart>
                
            </ResponsiveContainer>
            <div>Daily charge: <b>{this.state.dailyCharge}</b>&nbsp;
            Import cost/kwh: <b>{this.state.importCost}</b>&nbsp;
        Estimated cost: <b>${this.state.cost}</b></div>
            </div>
        ); 
    }
}


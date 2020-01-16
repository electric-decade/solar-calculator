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

import { ChartProps } from './Common';

type ChartState = {
    dailyCharge: number;
    importCost: number;
    feedInTariff: number;
    cost: number;
}

export default class DailySolarChart extends Component<ChartProps> {

    static defaultProps = {
        data: []
    }

    state: ChartState;

    constructor(props: ChartProps) {
        super(props)
        this.state = {dailyCharge: 0.9236, importCost: 0.23272, feedInTariff: 0.125, cost: 0};
    }

    prepareData() {
        var data = [];

        if (this.props.vecData.consumption.length > 0) {

            var x:number = 0;
            var consumption = this.props.vecData.consumption;
            var generation = this.props.vecData.generation;

            var cost: number = 0;
            for (x=0; x < consumption.length; x++) {
                var day = new Date();
                day.setFullYear(consumption[x].date[0],consumption[x].date[1]-1,consumption[x].date[2]-1);
                day.setHours(0);
                day.setMinutes(0);
                day.setSeconds(0);
 
                var sumImportKwh = 0;
                var sumExportKwh = 0;
                var sumConsumeSolarKwh = 0;

                var y =0;
                for (y=0; y < consumption[x].intervals.length; y++) {
                    var conKwh = consumption[x].intervals[y];     
                    var genKwh = generation[x].intervals[y];
                    
                    if (conKwh - genKwh >= 0) {
                        sumImportKwh += (conKwh - genKwh);
                        sumConsumeSolarKwh += genKwh;
                    } else {
                        sumExportKwh += (genKwh - conKwh);
                        sumConsumeSolarKwh += conKwh;
                    }
                }

                data.push( { time: day.getTime(), import: sumImportKwh.toFixed(2), export: -sumExportKwh.toFixed(2), solar: sumConsumeSolarKwh.toFixed(2) } );

                cost+= this.state.dailyCharge;
                cost+= (this.state.importCost * sumImportKwh);
                cost-= (this.state.feedInTariff * sumExportKwh);
            }

            console.log("Total cost: " + cost);
            this.state.cost = Math.floor(cost);

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
                <h2>Solar PV Simulator</h2>
                <p>This graph simulates adding a 7kw Solar PV system to your house.  The solar data used is the actual output from a real
                    solar system in Victoria that correctly shows seasonal variations. The graph shows a daily summary of import, export and solar energy used by the house.</p>
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
                    <Bar  dataKey="solar" stroke="#008800" stackId="a" unit=" kwh"  />
                    <Bar  dataKey="import" stroke="#880000" stackId="a" unit=" kwh"  />
                    <Bar  dataKey="export" stroke="#000088" stackId="b" unit=" kwh"  />
                    
                </BarChart>
            </ResponsiveContainer>
        <div>Daily charge: <b>{this.state.dailyCharge}</b>&nbsp;
            Import cost/kwh: <b>{this.state.importCost}</b>&nbsp;
            Feed in tariff/kwh: <b>{this.state.feedInTariff}</b>&nbsp;
        Estimated cost: <b>${this.state.cost}</b>
            </div>
            </div>
            
        ); 
    }
}


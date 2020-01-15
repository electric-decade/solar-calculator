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
    batteryKwh: number
    batteryMaxKwh: number
}


export default class DailyBatteryChart extends Component<ChartProps, ChartState> {

    static defaultProps = {
        data: []
    }

    state: ChartState;

    constructor(props: ChartProps) {
        super(props)
        this.state = {batteryKwh: 0, batteryMaxKwh: 13.5};
    }


    prepareData() {
        var x : number = 0;
        var data = [];

        if (this.props.vecData.consumption.length > 0) {


            var consumption = this.props.vecData.consumption;
            var generation = this.props.vecData.generation;

            var cost = 0;
            
            for (x=0; x < consumption.length; x++) {
                var day = new Date();
                day.setFullYear(consumption[x].date[0],consumption[x].date[1]-1,consumption[x].date[2]-1);
                day.setHours(0);
                day.setMinutes(0);
                day.setSeconds(0);
 
                let sumImportKwh: number = 0;
                let sumExportKwh: number = 0;
                let sumBatteryCharge : number = 0;
                let sumBatteryDischarge: number = 0;
                let sumConsumeSolarKwh: number = 0;

                let y : number =0;
                for (y=0; y < consumption[x].intervals.length; y++) {
                    let conKwh : number = consumption[x].intervals[y];     
                    let genKwh : number = generation[x].intervals[y];
                    
                    // Consumption is more than generation.
                    if (conKwh - genKwh >= 0) {
                        sumConsumeSolarKwh += genKwh;

                        let gap : number = (conKwh - genKwh);
                        if (this.state.batteryKwh > gap) {
                            // update battery state.
                            this.state.batteryKwh -= gap;
                            sumBatteryDischarge += gap;
                        } else {
                            gap -= this.state.batteryKwh;
                            sumBatteryDischarge += this.state.batteryKwh;
                            this.state.batteryKwh = 0;
                            sumImportKwh += gap;
                        }

                    } else {
                        sumConsumeSolarKwh += conKwh;

                        let extra : number = Math.abs(genKwh - conKwh);
                        if  ((this.state.batteryKwh + extra) < this.state.batteryMaxKwh) {
                            sumBatteryCharge += extra;
                            this.state.batteryKwh += extra;
                        } else {
                            let charge : number = this.state.batteryMaxKwh - this.state.batteryKwh;
                            sumBatteryCharge += charge;
                            this.state.batteryKwh = this.state.batteryMaxKwh;
                            sumExportKwh += (extra - charge);
                        }
                    }

                }

                data.push( { time: day.getTime(), import: sumImportKwh.toFixed(2), export: -sumExportKwh.toFixed(2), solar: sumConsumeSolarKwh.toFixed(2), charge: -sumBatteryCharge.toFixed(2), discharge: sumBatteryDischarge.toFixed(2) } );

                cost+= .9236;
                cost+= (.2927 * sumImportKwh);
                cost-= (.12 * sumExportKwh);
            }

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
                    <Bar  dataKey="discharge" stroke="#888800" stackId="a" unit=" kwh"  />
                    <Bar  dataKey="solar" stroke="#008800" stackId="a" unit=" kwh"  />
                    <Bar  dataKey="import" stroke="#880000" stackId="a" unit=" kwh"  />
                    <Bar  dataKey="charge" stroke="#008888" stackId="b" unit=" kwh"  />
                    <Bar  dataKey="export" stroke="#000088" stackId="b" unit=" kwh"  />
                    
                    
                </BarChart>
            </ResponsiveContainer>
            </div>
        ); 
    }
}


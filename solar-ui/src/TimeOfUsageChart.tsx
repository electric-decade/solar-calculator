import React, { Component } from 'react';
import {
    BarChart,
    Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartProps } from './Common';


export default class TimeOfUsageChart extends Component<ChartProps> {

    static defaultProps = {
        data: []
    }

    prepareData() {   
        var x:number;
        var y:number;
        var data;

        if (this.props.vecData.consumption.length > 0) {

            var consumption = this.props.vecData.consumption;
            

            data = new Array(48);
            for (x=0; x <48; x++) {
                data[x] = {kwh:0};
            }
            
            var dayCount = 0;
            for (x=0; x < consumption.length; x++) {
                dayCount++;

                for (y=0; y < consumption[x].intervals.length; y++) {
                    data[y].kwh += consumption[x].intervals[y];       
                }
            }

            // get the average per day.
            for (x=0; x <48; x++) {
                data[x].kwh /= dayCount;
            }

        } else {
            data = [];
            for (x=0; x<24; x++) {
                
                data.push( { kwh:0} );
            }
        }

        return data;
    }

    render() {
        return (
            <div className="daily-chart">
                <hr/>
                <h2>Time of use chart</h2>
                <p>This graph shows the average amount of energy used throughout the day. This can help visualise how much you use energy during the day compared to night.</p>
            <ResponsiveContainer width = '95%' height = {300}  >
                <BarChart width={400} height={400} data={this.prepareData()}  margin={{top: 5, right: 5, left: 30, bottom: 5}} >
                    <XAxis  domain = {['auto', 'auto']} />
                    <YAxis unit=" kwh"/>
                    <Tooltip />
                    <Bar  dataKey="kwh" stroke="#8884d8" stackId="a" unit="kwh"  />
                </BarChart>
            </ResponsiveContainer>
            </div>
        ); 
    }
}


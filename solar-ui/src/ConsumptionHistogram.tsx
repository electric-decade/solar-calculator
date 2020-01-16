import React, { Component } from 'react';
import {
    BarChart,
    Bar,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartProps } from './Common';

type ChartState = {
    ninety: number
}

export default class ConsumptionHistogramChart extends Component< ChartProps, ChartState> {

    static defaultProps = {
        data: [ { time:1, value:1}, { time:2, value:2}, { time:3, value:3}, { time:4, value:4} ]
    }

    state: ChartState;

    constructor(props: ChartProps) {
        super(props)
        this.state = {ninety: 0};
    }

    prepareData() {
        var data;
        var x : number;

        if (this.props.vecData.consumption.length > 0) {

            var consumption = this.props.vecData.consumption;
            var max = 0;
            var totalSum = 0;
            for (x=0; x < consumption.length; x++) {
                totalSum += consumption[x].sum;
                if (consumption[x].sum > max) {
                    max = consumption[x].sum;
                }
            }

            var intvalue = Math.ceil( max+1 ); 

            data = new Array(intvalue);
            for (x=0; x <intvalue; x++) {
                data[x] = {days:0};
            }
            
            for (x=0; x < consumption.length; x++) {
                var sum = Math.ceil(consumption[x].sum);
                data[sum].days++;
            }

            var ninetieth = totalSum * 0.8;
            var counter = 0;
            for (x=0; x < data.length; x++) {
                counter += (data[x].days * x);
                if (counter > ninetieth) {
                    this.state.ninety = x;
                    break;
                }
            }

        } else {
            data = [];
            for (x=0; x<50; x++) {            
                data.push( { days:0} );
            }
        }

        return data;
    }

    render() {
        return (
            <div className="daily-chart">
                <hr/>
                <h2>Usage Histogram</h2>
                <p>This shows a histogram of the amount of energy used each day.  The x-axis is the amount of energy used in a day, and the y-axis is the number of days that used
                    that amount of energy.  The 80th percentile is marked to provide a way of estimating the size of a solar PV system.
                </p>
            <ResponsiveContainer width = '95%' height = {300}  >
                <BarChart width={400} height={400} data={this.prepareData()}  margin={{top: 5, right: 5, left: 30, bottom: 5}} >
                    <XAxis  domain = {['auto', 'auto']} unit="kwh" minTickGap= {100} />
                    <YAxis unit=" days"/>
                    <Tooltip />
                    <ReferenceLine x={this.state.ninety} stroke="red" label="80th percentile" />
                    <Bar  dataKey="days" stroke="#8884d8" stackId="a" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        ); 
    }
}


import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { CalculatorData, ChartProps } from './Common';



export default class ConsumptionHistogramChart extends Component<ChartProps> {

    static defaultProps = {
        data: [ { time:1, value:1}, { time:2, value:2}, { time:3, value:3}, { time:4, value:4} ]
    }

    constructor(props: ChartProps) {
        super(props)
    }

    prepareData() {
        console.log("prepareData");

        var startDate = new Date();
        startDate.setFullYear(2019,0,0);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMinutes(0);
        var data = [];

        if (this.props.vecData.consumption.length > 0) {

            var consumption = this.props.vecData.consumption;
            var max = 0;
            for (x=0; x < consumption.length; x++) {
                if (consumption[x].sum > max) {
                    max = consumption[x].sum;
                }
            }

            var intvalue = Math.ceil( max+1 ); 
            var data = new Array(intvalue);
            for (x=0; x <intvalue; x++) {
                data[x] = {days:0};
            }
            
            var x = 0;
            
            for (x=0; x < consumption.length; x++) {
                var sum = Math.ceil(consumption[x].sum);
                data[sum].days++;
            }


        } else {

            var x =0;
            for ( x=0; x<100; x++) {
                
                data.push( { days:0} );
            }
        }

        return data;
    }

    render() {
        return (
            <div className="daily-chart">
            <ResponsiveContainer width = '95%' height = {300}  >
                <BarChart width={400} height={400} data={this.prepareData()}  margin={{top: 5, right: 5, left: 30, bottom: 5}} >
                    <XAxis  domain = {['auto', 'auto']} />
                    <YAxis unit=" days"/>
                    <Tooltip />
                    <Bar  dataKey="days" stroke="#8884d8" stackId="a" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        ); 
    }
}


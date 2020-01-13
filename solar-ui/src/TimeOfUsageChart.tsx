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


export default class TimeOfUsageChart extends Component<ChartProps> {

    static defaultProps = {
        data: []
    }

    constructor(props: ChartProps) {
        super(props)
    }


    prepareData() {

        
        var data = [];

        if (this.props.vecData.consumption.length > 0) {

            var consumption = this.props.vecData.consumption;

            var data = new Array(48);
            for (x=0; x <48; x++) {
                data[x] = {kwh:0};
            }
            
            var x = 0;
            
            var dayCount = 0;
            for (x=0; x < consumption.length; x++) {
                dayCount++;
                var y =0;
                for (y=0; y < consumption[x].intervals.length; y++) {
                    data[y].kwh += consumption[x].intervals[y];       
                }
            }

            // get the average per day.
            for (x=0; x <48; x++) {
                data[x].kwh /= dayCount;
            }

        } else {

            var x =0;
            for ( x=0; x<24; x++) {
                
                data.push( { kwh:0} );
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
                    <YAxis unit=" kwh"/>
                    <Tooltip />
                    <Bar  dataKey="kwh" stroke="#8884d8" stackId="a" unit="kwh"  />
                </BarChart>
            </ResponsiveContainer>
            </div>
        ); 
    }
}


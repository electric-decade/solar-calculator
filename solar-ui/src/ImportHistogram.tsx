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



export default class DailySolarChart extends Component<ChartProps> {

    static defaultProps = {
        data: []
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

        var importData = [];
        if (this.props.vecData.consumption.length > 0) {

            var x = 0;
            var consumption = this.props.vecData.consumption;
            var generation = this.props.vecData.generation;

            var maxImport = 0;
            var cost = 0;
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

                if (sumImportKwh > maxImport) {
                    maxImport = sumImportKwh;
                }

                importData.push( { time: day.getTime(), import: sumImportKwh, export: sumExportKwh, solar: sumConsumeSolarKwh } );
            }

            var intvalue = Math.ceil( maxImport+1 ); 
            var data = new Array(intvalue);
            for (x=0; x <intvalue; x++) {
                data[x] = {days:0};
            }
            
            var x = 0;
            
            for (x=0; x < importData.length; x++) {
                var sum = Math.ceil(importData[x].import);
                data[sum].days++;
            }

            

        } else {

            var x =0;
            for ( x=0; x<365; x++) {
                
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
                    <XAxis domain = {['auto', 'auto']} />
                    <YAxis unit=" days"/>
                    <Tooltip  />
                    <Bar  dataKey="days" stroke="#880000"  unit=" days"  />
                    
                </BarChart>
            </ResponsiveContainer>
            </div>
        ); 
    }
}


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


export default class DailySolarChart extends Component<ChartProps, ChartState> {

    static defaultProps = {
        data: []
    }

    state: ChartState;

    constructor(props: ChartProps) {
        super(props)
        this.state = {ninety: 0};
    }


    prepareData() {
        var x : number = 0;
        var data;
        var importData = [];
        var importTotal = 0;
        if (this.props.vecData.consumption.length > 0) {
            var consumption = this.props.vecData.consumption;
            var generation = this.props.vecData.generation;

            var maxImport = 0;   
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

                importTotal += sumImportKwh;
                importData.push( { time: day.getTime(), import: sumImportKwh, export: sumExportKwh, solar: sumConsumeSolarKwh } );
            }

            var intvalue = Math.ceil( maxImport+1 ); 
            data = new Array(intvalue);
            for (x=0; x <intvalue; x++) {
                data[x] = {days:0};
            }
            
            for (x=0; x < importData.length; x++) {
                var sum = Math.ceil(importData[x].import);
                data[sum].days++;
            }

            var ninetieth = importTotal * 0.8;
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
            
            var startDate = new Date();
            startDate.setFullYear(2019,0,0);
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMinutes(0);

            for ( x=0; x<50; x++) {
                data.push( { time: (startDate.getTime()+(x*86400*1000)), value:0} );
            }
        }

        return data;
    }

    render() {
        return (
            <div className="daily-chart">
                <hr/>
                <h2>Import Histogram</h2>
                <p>This graph shows an import energy histogram based on having a solar system installed. The x-axis shows the amount of energy that is imported each day.
                    The y-axis shows the number of days that amount of energy was imported from the grid. The 80th percentile is marked to assist in choosing
                    a battery size that will cover 80% of days.</p>
            <ResponsiveContainer width = '95%' height = {300}  >
                <BarChart width={400} height={400} data={this.prepareData()}  margin={{top: 5, right: 5, left: 30, bottom: 5}} >
                    <XAxis domain = {['auto', 'auto']} unit="kwh" minTickGap= {100} />
                    <YAxis unit=" days"/>
                    <Tooltip   />
                    <ReferenceLine x={this.state.ninety} stroke="red" label="80th percentile" />
                    <Bar  dataKey="days" stroke="#880000"  unit=" days"  />
                    
                </BarChart>
            </ResponsiveContainer>
            </div>
        ); 
    }
}


package com.electric_decade.calculator.reader;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.simpleflatmapper.csv.CsvParser;

import com.electric_decade.calculator.api.CalculatorData;
import com.electric_decade.calculator.api.SeriesDay;

public class VecReader {

    private static int COLUMN_NMI = 0;
    private static int COLUMN_METER = 1;
    private static int COLUMN_CON_GEN = 2;
    private static int COLUMN_DATE = 3;
    private static int COLUMN_ESTIMATED = 4;
    private static int COLUMN_INTERVAL_START = 5;

    private static int INTERVAL_COUNT = 48;

    private DateTimeFormatter dateParser;

    public VecReader() {
        dateParser = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    }

    // A simple Victorian Energy Compare data reader.
    public CalculatorData read(InputStream in) throws IOException {
        Reader reader = new InputStreamReader(in);

        CalculatorData result = new CalculatorData();
        List<SeriesDay> consumptionData = new ArrayList<>();
        List<SeriesDay> generationData = new ArrayList<>();

        Iterator<String[]> it = CsvParser.iterator(reader);

        boolean readHeader = false;
        int counter = 0;
        while (it.hasNext()) {
            String[] values = it.next();
            counter++;

            if (counter > 750) {
                // read more than two years.  Enough data.
                break;
            }

            if (!readHeader) {
                // skip the header line.
                readHeader = true;
                continue;
            }

            if (values.length != 53) {
                // ignore lines that have wrong number of values.
                continue;
            }

            SeriesDay day = new SeriesDay();
            //day.setNmi(values[COLUMN_NMI]);
            //day.setMeter(values[COLUMN_METER]);

            if ("Consumption".equalsIgnoreCase(values[COLUMN_CON_GEN])) {
                consumptionData.add(day);
            } else {
                generationData.add(day);
            }

            day.setDate(LocalDate.parse(values[COLUMN_DATE], dateParser));

            //if ("No".equals(values[COLUMN_ESTIMATED])) {
            //    day.setEstimated(false);
            //} else {
            //    day.setEstimated(true);
            //}

            float[] intervals = new float[INTERVAL_COUNT];
            float sum = 0;

            float firstValue = Float.parseFloat(values[COLUMN_INTERVAL_START]);
            float min = firstValue;
            float max = firstValue;

            for (int x = 0; x < INTERVAL_COUNT; x++) {
                String value = values[COLUMN_INTERVAL_START + x];
                if (value.isBlank()) {
                    // If less than a full day ignore the data.
                    continue;
                }

                // parse the value.
                float v = intervals[x] = Float.parseFloat(value);

                // add to sum.
                sum += v;

                if (v < min) {
                    min = v;
                }

                if (v > max) {
                    max = v;
                }
            }

            day.setSum(sum);
            day.setAverage(sum / INTERVAL_COUNT);
            day.setMin(min);
            day.setMax(max);

            day.setIntervals(intervals);
        }

        if (consumptionData.size() > 0) {
            result.addSeries(CalculatorData.CONSUMPTION, consumptionData);
        }
        if (generationData.size() > 0) {
            result.addSeries(CalculatorData.GENERATION, generationData);
        }

        return result;

    }
}

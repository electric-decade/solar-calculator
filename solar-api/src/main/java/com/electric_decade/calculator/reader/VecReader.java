package com.electric_decade.calculator.reader;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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
            result.addSeries(CalculatorData.GENERATION, getSolar(consumptionData, 1.3f));
        }
        if (generationData.size() > 0) {
            result.addSeries(CalculatorData.EXPORT, generationData);
        }

        return result;

    }

    private static Map<LocalDate, SeriesDay> solarTemplate;

    public List<SeriesDay> getSolar(List<SeriesDay> consumption, float ratio) throws IOException {
        List<SeriesDay> solar = new ArrayList<SeriesDay>();
        if (solarTemplate == null) {
            solarTemplate = loadSolar();
        }

        for (SeriesDay consumptionDay : consumption) {

            // get the corresponding date in 2019.
            SeriesDay day = solarTemplate.get(consumptionDay.getDate().withYear(2019));

            SeriesDay updateDate = new SeriesDay();
            updateDate.setDate(consumptionDay.getDate());
            updateDate.setSum(day.getSum() * ratio);
            updateDate.setMax(day.getMax() * ratio);
            updateDate.setMin(day.getMin() * ratio);
            updateDate.setAverage(day.getAverage() * ratio);
            float[] orig = day.getIntervals();
            float[] values = new float[INTERVAL_COUNT];
            for (int x = 0; x < orig.length; x++) {
                values[x] = orig[x] * ratio;
            }
            updateDate.setIntervals(values);

            solar.add(updateDate);
        }

        return solar;
    }

    private DateTimeFormatter solarDateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public Map<LocalDate, SeriesDay> loadSolar() throws IOException {

        Map<LocalDate, SeriesDay> solar = new HashMap<>();

        InputStream solarYear = this.getClass().getResourceAsStream("/solarYear.csv");
        Iterator<String[]> it = CsvParser.iterator(new InputStreamReader(solarYear));

        while (it.hasNext()) {

            String[] row = it.next();

            float[] intervals = new float[INTERVAL_COUNT];

            SeriesDay day = new SeriesDay();

            LocalDate date = LocalDate.parse(row[0], solarDateFormat);

            float sum = 0;

            float firstValue = Float.parseFloat(row[1]);
            float min = firstValue;
            float max = firstValue;

            for (int x = 0; x < INTERVAL_COUNT; x++) {
                String value = row[1 + x];
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

            day.setDate(date);
            day.setSum(sum);
            day.setAverage(sum / INTERVAL_COUNT);
            day.setMin(min);
            day.setMax(max);

            day.setIntervals(intervals);

            solar.put(date, day);

        }

        return solar;
    }
}

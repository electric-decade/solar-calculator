package com.electric_decade.calculator.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CalculatorData {

    public static final String CONSUMPTION = "consumption";
    public static final String EXPORT = "export";
    public static final String GENERATION = "generation";

    private Map<String, List<SeriesDay>> data;

    public CalculatorData() {
        data = new HashMap<>();
    }

    public Map<String, List<SeriesDay>> getData() {
        return data;
    }

    public void addSeries(String name, List<SeriesDay> series) {
        data.put(name, series);
    }

    public List<SeriesDay> getSeries(String name) {
        return data.get(name);
    }
}

package com.electric_decade.calculator.api;

import java.time.LocalDate;

public class SeriesDay {
    private LocalDate date;
    private float[] intervals;
    private float sum;
    private float average;
    private float min;
    private float max;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public float[] getIntervals() {
        return intervals;
    }

    public void setIntervals(float[] intervals) {
        this.intervals = intervals;
    }

    public float getSum() {
        return sum;
    }

    public void setSum(float sum) {
        this.sum = sum;
    }

    public float getAverage() {
        return average;
    }

    public void setAverage(float average) {
        this.average = average;
    }

    public float getMin() {
        return min;
    }

    public void setMin(float min) {
        this.min = min;
    }

    public float getMax() {
        return max;
    }

    public void setMax(float max) {
        this.max = max;
    }

}

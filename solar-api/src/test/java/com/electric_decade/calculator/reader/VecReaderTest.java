package com.electric_decade.calculator.reader;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.electric_decade.calculator.api.CalculatorData;
import com.electric_decade.calculator.api.SeriesDay;

public class VecReaderTest {

    private VecReader vecReader;

    @BeforeEach
    public void before() {
        vecReader = new VecReader();
    }

    @Test
    public void testReadVecData() throws IOException {
        InputStream input = this.getClass().getResourceAsStream("/VecSampleData.csv");
        Assertions.assertNotNull(input);

        CalculatorData data = vecReader.read(input);
        Assertions.assertNotNull(data);
        Assertions.assertEquals(30, data.getSeries("consumption").size());
    }

    @Test
    public void testReadSolar() throws IOException {
        Map<LocalDate, SeriesDay> solar = vecReader.loadSolar();
        Assertions.assertNotNull(solar);
        Assertions.assertEquals(365, solar.size());
    }
}

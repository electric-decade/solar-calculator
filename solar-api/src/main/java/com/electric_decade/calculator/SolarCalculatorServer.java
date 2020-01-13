package com.electric_decade.calculator;

import java.util.logging.Logger;

import com.electric_decade.calculator.api.SolarService;

import io.helidon.common.http.Http;
import io.helidon.media.jackson.server.JacksonSupport;
import io.helidon.webserver.Routing;
import io.helidon.webserver.ServerConfiguration;
import io.helidon.webserver.WebServer;

public class SolarCalculatorServer {

    private static final Logger logger = Logger.getLogger(SolarCalculatorServer.class.getName());

    public static void main(String[] args) {

        ServerConfiguration config = ServerConfiguration.builder().port(8080).build();

        WebServer server = WebServer.create(config, createRouting());

        server.start().thenAccept(ws -> logger.info("Service running at: http://localhost:" + ws.port()));
    }

    private static Routing createRouting() {
        return Routing.builder()
                        // Add JSON support to all end-points
                        .register(JacksonSupport.create()).register("/process", new SolarService())
                        // Global exception handler
                        .error(Exception.class, (req, res, ex) -> {
                            //ex.printStackTrace();
                            res.status(Http.Status.BAD_REQUEST_400).send();
                        }).build();
    }
}

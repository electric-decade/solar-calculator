package com.electric_decade.calculator;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Logger;

import com.electric_decade.calculator.api.SolarService;

import io.helidon.common.http.Http;
import io.helidon.media.jackson.server.JacksonSupport;
import io.helidon.webserver.Routing;
import io.helidon.webserver.ServerConfiguration;
import io.helidon.webserver.StaticContentSupport;
import io.helidon.webserver.WebServer;

public class SolarCalculatorServer {

    private static final Logger logger = Logger.getLogger(SolarCalculatorServer.class.getName());

    public static void main(String[] args) {

        boolean isDevelopment = (System.getenv("DEVELOPMENT") != null) && System.getenv("DEVELOPMENT").equalsIgnoreCase("true");

        ServerConfiguration config = ServerConfiguration.builder().port(8080).build();

        WebServer server = WebServer.create(config, createRouting(isDevelopment));

        server.start().thenAccept(ws -> logger.info("Service running at: http://localhost:" + ws.port()));

        // Server threads are not demon. NO need to block. Just react.
        server.whenShutdown().thenRun(() -> System.out.println("WEB server is DOWN. Good bye!"));
    }

    private static Routing createRouting(boolean isDevelopment) {

        Path staticPath;
        if (isDevelopment) {
            staticPath = Paths.get("extras/app/web");
        } else {
            staticPath = Paths.get("web");
        }

        if (!staticPath.toFile().exists()) {
            System.err.println("Static content not found");
            System.exit(-1);
        }

        return Routing.builder()
                        // Add JSON support to all end-points
                        .register(JacksonSupport.create()).register("/process", new SolarService())
                        // Register static content
                        .register("/", StaticContentSupport.builder(staticPath).welcomeFileName("index.html").build())
                        // Global exception handler
                        .error(Exception.class, (req, res, ex) -> {
                            System.out.println("Req:" + req.query() + "ex: " + ex.getMessage());
                            res.status(Http.Status.NOT_FOUND_404).send();
                        })

                        // Build the routing.
                        .build();
    }
}

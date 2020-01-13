package com.electric_decade.calculator.api;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.commons.fileupload.MultipartStream;

import com.electric_decade.calculator.reader.VecReader;

import io.helidon.common.http.DataChunk;
import io.helidon.common.http.Http.ResponseStatus;
import io.helidon.common.http.MediaType;
import io.helidon.common.reactive.Flow;
import io.helidon.common.reactive.Flow.Subscription;
import io.helidon.webserver.Routing.Rules;
import io.helidon.webserver.ServerRequest;
import io.helidon.webserver.ServerResponse;
import io.helidon.webserver.Service;

public class SolarService implements Service {

    @Override
    public void update(Rules rules) {
        rules.post("/", this::upload);
    }

    private synchronized void upload(ServerRequest req, ServerResponse res) {

        byte[] boundary = null;
        MediaType contentType = req.headers().contentType().get();
        if (contentType.type().equals(MediaType.MULTIPART_FORM_DATA.type()) && contentType.subtype().equals(MediaType.MULTIPART_FORM_DATA.subtype())) {
            boundary = contentType.parameters().get("boundary").getBytes();
        }

        req.content().subscribe(new ServerFileWriter(res, boundary));
    }

    private class ServerFileWriter implements Flow.Subscriber<DataChunk> {

        private final ByteArrayOutputStream channel;

        private final ServerResponse response;
        private final byte[] multipartBoundary;

        ServerFileWriter(ServerResponse response, byte[] multipartBoundary) {
            this.response = response;
            this.multipartBoundary = multipartBoundary;
            channel = new ByteArrayOutputStream();
        }

        @Override
        public void onSubscribe(Subscription subscription) {
            subscription.request(Long.MAX_VALUE);
        }

        @Override
        public void onNext(DataChunk chunk) {
            try {
                channel.write(chunk.bytes());
                chunk.release();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onError(Throwable throwable) {
            System.err.println("Failed to upload. " + throwable.getMessage());
            response.status(ResponseStatus.create(403));
        }

        @Override
        public void onComplete() {
            try {
                channel.close();

                if (multipartBoundary != null) {
                    try {
                        InputStream input = new ByteArrayInputStream(channel.toByteArray());
                        MultipartStream multipartStream = new MultipartStream(input, multipartBoundary, 4096, null);
                        boolean nextPart = multipartStream.skipPreamble();
                        ByteArrayOutputStream output = new ByteArrayOutputStream();
                        while (nextPart) {
                            String header = multipartStream.readHeaders();

                            // process headers
                            // create some output stream
                            multipartStream.readBodyData(output);
                            nextPart = multipartStream.readBoundary();

                            // only interested in first part for now.
                            break;
                        }

                        CalculatorData data = parseInput(new ByteArrayInputStream(output.toByteArray()));
                        response.headers().add("Access-Control-Allow-Origin", "*");
                        response.status(ResponseStatus.create(200)).send(data.getData());

                    } catch (MultipartStream.MalformedStreamException e) {
                        // the stream failed to follow required syntax
                    }
                } else {

                    CalculatorData data = parseInput(new ByteArrayInputStream(channel.toByteArray()));
                    response.headers().add("Access-Control-Allow-Origin", "*");
                    response.status(ResponseStatus.create(200)).send(data.getData());
                }
            } catch (IOException e) {
                response.status(ResponseStatus.create(500)).send(e.getMessage());
            }

        }

    }

    private CalculatorData parseInput(InputStream input) throws IOException {
        VecReader reader = new VecReader();
        CalculatorData data = reader.read(input);
        List<SeriesDay> consumption = data.getSeries(CalculatorData.CONSUMPTION);
        if (consumption != null) {
            System.out.println("VecReader read " + consumption.size() + " consumption records ");
        }
        return data;
    }

}

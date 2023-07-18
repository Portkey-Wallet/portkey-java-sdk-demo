package io.aelf.demo.internal;

import io.aelf.internal.sdkv2.AElfClientAsync;
import io.aelf.internal.sdkv2.AElfClientV2;

public class ClientHolder {
    private static final AElfClientAsync client = new AElfClientV2(TestParams.CLIENT_HTTP_URL);
    public static AElfClientAsync getClient() {
        return client;
    }
}


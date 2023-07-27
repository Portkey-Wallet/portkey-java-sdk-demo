package com.aelf.demo.internal;

import io.aelf.sdk.AElfClient;

@SuppressWarnings("deprecation")
public class ClientHolder {
    public static void setClient(AElfClient client) {
        ClientHolder.client = client;
    }

    private static AElfClient client;
    public static AElfClient getClient() {
        return client;
    }
}


package com.aelf.demo.internal;

public interface FieldType {
    int INTEGER = 0;
    int LONG = 1;
    int BOOLEAN = 2;
    int STRING = 3;
    int ANY_JSON_OBJECT = 4;
    // it means Boolean instead of boolean
    int WRAPPED_BOOLEAN = 5;
}

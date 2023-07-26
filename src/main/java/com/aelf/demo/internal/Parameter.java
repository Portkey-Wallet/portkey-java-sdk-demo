package com.aelf.demo.internal;

public class Parameter<T> {
    public final T content;
    public final int position;
    public final int type;

    public Parameter(T content, int position, int type) {
        this.content = content;
        this.position = position;
        this.type = type;
    }
}

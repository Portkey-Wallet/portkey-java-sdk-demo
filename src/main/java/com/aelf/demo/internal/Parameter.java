package com.aelf.demo.internal;

public class Parameter<T> {
    public T content;
    public int position;

    public Parameter(T content, int position) {
        this.content = content;
        this.position = position;
    }
}

package com.algolens.backend.model;

import lombok.Data;

@Data
public class ExecutionResult {
    private String requestId;
    private boolean success;

    private String stdout;
    private String stderr;

    private int exitCode;
}

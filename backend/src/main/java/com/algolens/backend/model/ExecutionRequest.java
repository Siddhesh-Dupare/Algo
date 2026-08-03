package com.algolens.backend.model;

import lombok.Data;

@Data
public class ExecutionRequest {
    private String type;
    private String requestId;
    private String language;
    private String code;
}

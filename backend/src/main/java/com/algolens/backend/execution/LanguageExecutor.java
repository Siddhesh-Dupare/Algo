
package com.algolens.backend.execution;

import com.algolens.backend.model.ExecutionRequest;
import com.algolens.backend.model.ExecutionResult;

public interface LanguageExecutor {
    ExecutionResult execute(ExecutionRequest request) throws Exception;
    String getLanguage();
}

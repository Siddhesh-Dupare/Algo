
package com.algolens.backend.execution;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.algolens.backend.execution.LanguageExecutor;
import com.algolens.backend.model.ExecutionResult;
import com.algolens.backend.model.ExecutionRequest;
import com.algolens.backend.model.ExecutionListeners;

@Service
public class ExecutionService {

    private final Map<String, LanguageExecutor> executorMap;

    public ExecutionService(List<LanguageExecutor> executorList) {
        executorMap = executorList.stream()
        .collect(Collectors.toMap(LanguageExecutor::getLanguage, executor -> executor));
    }

    public ExecutionResult execute(ExecutionRequest request) throws Exception {

        LanguageExecutor executor = executorMap.get(request.getLanguage());

        if (executor == null) {
            throw new IllegalArgumentException("Unsupported language");
        }

        return executor.execute(request, new ExecutionListeners() {
            @Override
            public void onStatus(String status) {
                System.out.println(status);
            }
        });
    }

}

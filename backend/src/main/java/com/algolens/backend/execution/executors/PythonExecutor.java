
package com.algolens.backend.execution.executors;

import org.springframework.stereotype.Component;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;

import com.algolens.backend.model.ExecutionResult;
import com.algolens.backend.model.ExecutionRequest;

import com.algolens.backend.execution.LanguageExecutor;

@Component
public class PythonExecutor implements LanguageExecutor {

    @Override
    public String getLanguage() {
        return "python";
    }

    @Override
    public ExecutionResult execute(ExecutionRequest request) throws Exception {

        Path pythonFile = createPythonFile(request);

        ProcessBuilder processBuilder = new ProcessBuilder("python", pythonFile.toString());
        Process process = processBuilder.start();

        int exitCode = process.waitFor();

        System.out.println("Exit code: " + exitCode);

        ExecutionResult result = new ExecutionResult();
        result.setSuccess(exitCode == 0);

        return result;
    }

    private Path createPythonFile(ExecutionRequest request) throws IOException {

        Path tempDirectory = Paths.get("temp");

        if (Files.notExists(tempDirectory)) {
            Files.createDirectories(tempDirectory);
        }

        Path pythonFile = tempDirectory.resolve(request.getRequestId() + ".py");

        Files.writeString(pythonFile, request.getCode());

        return pythonFile;
    }
}

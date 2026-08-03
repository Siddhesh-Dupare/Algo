
package com.algolens.backend.execution.executors;

import org.springframework.stereotype.Component;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;
import java.io.OutputStream;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.TimeUnit;

import com.algolens.backend.model.ExecutionResult;
import com.algolens.backend.model.ExecutionRequest;

import com.algolens.backend.execution.LanguageExecutor;

@Component
public class PythonExecutor implements LanguageExecutor {

    AtomicReference<String> stdout = new AtomicReference<>("");
    AtomicReference<String> stderr = new AtomicReference<>("");

    @Override
    public String getLanguage() {
        return "python";
    }

    @Override
    public ExecutionResult execute(ExecutionRequest request) throws Exception {

        Path pythonFile = createPythonFile(request);

        ProcessBuilder processBuilder = new ProcessBuilder("python", pythonFile.toString());
        Process process = executeProcess(request, processBuilder);

        Thread outThread = new Thread(() -> {
            try {
                stdout.set(readStream(process.getInputStream())); // NOTE: Read stdout (python stdout)
            } catch (Exception exception) {
                exception.printStackTrace();
            }
        });

        Thread errThread = new Thread(() -> {
            try {
                stderr.set(readStream(process.getErrorStream())); // NOTE: Read stderr (python stderr)
            } catch (Exception exception) {
                exception.printStackTrace();
            }
        });

        outThread.start();
        errThread.start();

        // NOTE: Get Input for request
        boolean finished = process.waitFor(5, TimeUnit.SECONDS);
        if (!finished)
            process.destroyForcibly();

        int exitCode = process.exitValue();

        outThread.join();
        errThread.join();

        System.out.println("Output: " + stdout.get());
        System.out.println("Error: " + stderr.get());
        System.out.println("Exit code: " + exitCode);

        ExecutionResult result = new ExecutionResult();
        result.setSuccess(exitCode == 0);

        return result;
    }

    // NOTE: 1. Create a temp file with language extension
    private Path createPythonFile(ExecutionRequest request) throws IOException {

        Path tempDirectory = Paths.get("temp");

        if (Files.notExists(tempDirectory)) {
            Files.createDirectories(tempDirectory);
        }

        Path pythonFile = tempDirectory.resolve(request.getRequestId() + ".py");

        // NOTE: 2. Write the code to the temp file
        Files.writeString(pythonFile, request.getCode());

        return pythonFile;
    }

    // NOTE: 3. Execute the temp file
    private Process executeProcess(ExecutionRequest request, ProcessBuilder processBuilder) throws IOException {
        Process process = processBuilder.start();

        OutputStream stdin = process.getOutputStream();
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(stdin));

        bufferedWriter.write(request.getInput());
        bufferedWriter.newLine();
        bufferedWriter.flush();
        bufferedWriter.close();

        return process;
    }

    // NOTE: 4. Read stdout and stderr
    private String readStream(InputStream inputStream) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();

        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line).append(System.lineSeparator());
            }
        }

        return stringBuilder.toString();
    }
}

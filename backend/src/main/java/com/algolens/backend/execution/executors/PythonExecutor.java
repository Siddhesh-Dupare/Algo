
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.algolens.backend.model.ExecutionResult;
import com.algolens.backend.model.ExecutionRequest;
import com.algolens.backend.model.ExecutionListeners;

import com.algolens.backend.execution.LanguageExecutor;

@Component
public class PythonExecutor implements LanguageExecutor {

    private static final Logger logger = LoggerFactory.getLogger(PythonExecutor.class);
    private static final long EXECUTION_TIMEOUT = 5;

    @Override
    public String getLanguage() {
        return "python";
    }

    @Override
    public ExecutionResult execute(ExecutionRequest request, ExecutionListeners listeners) throws Exception {

        AtomicReference<String> stdout = new AtomicReference<>("");
        AtomicReference<String> stderr = new AtomicReference<>("");
        ExecutionResult result = new ExecutionResult();

        Path pythonFile = null;

        try {
            listeners.onStatus("CREATING_FILE");
            pythonFile = createPythonFile(request);

            ProcessBuilder processBuilder = new ProcessBuilder("python", pythonFile.toString());
            listeners.onStatus("STARTING_PROCESS");
            Process process = executeProcess(request, processBuilder);

            listeners.onStatus("RUNNING");
            Thread outThread = new Thread(() -> {
                try {
                    stdout.set(readStream(process.getInputStream())); // NOTE: Read stdout (python stdout)
                } catch (IOException exception) {
                    logger.error("Error reading stdout", exception);
                }
            });

            Thread errThread = new Thread(() -> {
                try {
                    stderr.set(readStream(process.getErrorStream())); // NOTE: Read stderr (python stderr)
                } catch (IOException exception) {
                    logger.error("Error reading stderr", exception);
                }
            });

            outThread.start();
            errThread.start();

            // NOTE: Get Input for request
            boolean finished = process.waitFor(EXECUTION_TIMEOUT, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                process.waitFor();

                outThread.join();
                errThread.join();

                result.setRequestId(request.getRequestId());
                result.setSuccess(false);
                result.setExitCode(-1);
                result.setStderr("Execution timed out");
                listeners.onStatus("TIMED_OUT");

                return result;
            }

            int exitCode = process.exitValue();

            outThread.join();
            errThread.join();

            result.setRequestId(request.getRequestId());
            result.setSuccess(exitCode == 0);
            result.setStdout(stdout.get());
            result.setStderr(stderr.get());
            result.setExitCode(exitCode);
        }

        catch (Exception exception) {
            logger.error("Error executing Python code", exception);
        }

        finally {
            if (pythonFile != null)
                Files.deleteIfExists(pythonFile);
            listeners.onStatus("FINISHED");
        }

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

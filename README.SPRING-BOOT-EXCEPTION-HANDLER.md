# CustomExceptionHandler (Spring Boot Global Error Handler)

This class provides a centralized exception handling mechanism for a Spring Boot application using `@RestControllerAdvice`. It standardizes error responses using `ProblemDetail` and supports both global and form-level error handling.

---

## Key Features

- Centralized exception handling
- Consistent error response format (`ProblemDetail`)
- Differentiation between:
  - `GLOBAL` errors (general failures)
  - `FORM` errors (validation errors with field-level details)

- Structured validation error responses using `errors` property (no JSON string parsing required on frontend)

---

## Implementation

```java
@Slf4j
@RestControllerAdvice
public class CustomExceptionHandler {

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ProblemDetail> handleGenericException(Exception ex) {
                log.error("Unhandled exception", ex);
                return buildProblemDetail(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(),
                                ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ProblemDetail> handleRuntimeException(RuntimeException ex) {
                log.error("Unhandled RuntimeException", ex);
                return buildProblemDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                                "Something went wrong. Please try again.",
                                ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(LockedException.class)
        public ResponseEntity<ProblemDetail> handleLockedException(LockedException ex) {
                log.error("LockedException error: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.LOCKED,
                                ex.getMessage(),
                                ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(AuthorizationDeniedException.class)
        public ResponseEntity<ProblemDetail> handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
                log.warn("Authorization denied exception: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.UNAUTHORIZED, ex.getMessage(), ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(NoResourceFoundException.class)
        public ResponseEntity<ProblemDetail> handleNoResourceFoundException(NoResourceFoundException ex) {
                log.warn("No static resource found: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.NOT_FOUND, ex.getMessage(), ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ProblemDetail> handleBadCredentialsException(BadCredentialsException ex) {
                log.warn("Bad credentials: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.BAD_REQUEST, ex.getMessage(), ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(UsernameNotFoundException.class)
        public ResponseEntity<ProblemDetail> handleUsernameNotFoundException(UsernameNotFoundException ex) {
                log.warn("User not found: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.BAD_REQUEST, ex.getMessage(), ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(NoHandlerFoundException.class)
        public ResponseEntity<ProblemDetail> handleNoHandlerFoundException(NoHandlerFoundException ex) {
                log.warn("No handler found: {}", ex.getRequestURL());
                return buildProblemDetail(HttpStatus.NOT_FOUND, "The requested URL was not found.",
                                ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(DataValidationException.class)
        public ResponseEntity<ProblemDetail> handleDataValidationException(DataValidationException ex) {
                log.warn("Data validation failed: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.BAD_REQUEST, ex.getMessage(), ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ProblemDetail> handleResourceNotFoundException(ResourceNotFoundException ex) {
                log.warn("Resource not found: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.NOT_FOUND, ex.getMessage(), ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(FileStorageException.class)
        public ResponseEntity<ProblemDetail> handleFileStorageException(FileStorageException ex) {
                log.warn("File storage error: {}", ex.getMessage());
                return buildProblemDetail(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), ProblemDetailType.GLOBAL);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<ProblemDetail> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
                BindingResult result = ex.getBindingResult();
                Map<String, String> fieldErrors = new HashMap<>();
                for (FieldError error : result.getFieldErrors()) {
                        fieldErrors.put(error.getField(), error.getDefaultMessage());
                }

                ProblemDetail detail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

                detail.setTitle("Validation Failed");
                detail.setDetail("Invalid request data");
                detail.setProperty("detailType", ProblemDetailType.FORM);
                detail.setProperty("errors", fieldErrors);

                return new ResponseEntity<>(detail, HttpStatus.BAD_REQUEST);
        }

        private ResponseEntity<ProblemDetail> buildProblemDetail(HttpStatus status, String message,
                        ProblemDetailType type) {
                ProblemDetail detail = ProblemDetail.forStatusAndDetail(status, message);
                detail.setProperty("detailType", type);
                return new ResponseEntity<>(detail, status);
        }

}
```

---

## Notes

- Validation errors are returned as structured data under `errors` instead of a JSON string.
- This design simplifies frontend error handling (no need for `JSON.parse`).
- `detailType` helps distinguish between form-level and global errors.
- Logging levels are appropriately chosen (`error` for critical, `warn` for expected failures).

---

## Suggested Improvements (Optional)

- Consider removing `detailType` in the future and infer type based on presence of `errors`.
- Add `type` or `instance` fields for better observability if needed.
- Integrate with centralized logging/monitoring tools (e.g., ELK, Sentry).

---

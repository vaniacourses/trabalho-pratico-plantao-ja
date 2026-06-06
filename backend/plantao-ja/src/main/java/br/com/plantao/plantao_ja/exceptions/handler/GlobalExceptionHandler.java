package br.com.plantao.plantao_ja.exceptions.handler;

import br.com.plantao.plantao_ja.exception.CustomExceptionResponse;
import br.com.plantao.plantao_ja.exception.ObjetoNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ObjetoNotFoundException.class)
    public final ResponseEntity<CustomExceptionResponse> notFoundExceptionHandler(Exception ex) {
        CustomExceptionResponse exceptionResponse = new CustomExceptionResponse(new java.util.Date(), ex.getMessage(), "");
        return new ResponseEntity<>(exceptionResponse, org.springframework.http.HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<CustomExceptionResponse> allExceptionHandler(Exception ex) {
        CustomExceptionResponse exceptionResponse = new CustomExceptionResponse(new java.util.Date(), ex.getMessage(), "");
        return new ResponseEntity<>(exceptionResponse, org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
    }




}

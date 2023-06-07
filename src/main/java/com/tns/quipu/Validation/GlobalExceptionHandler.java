package com.tns.quipu.Validation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler (MethodArgumentNotValidException.class)
  public ResponseEntity<String> handleMethodArgumentNotValidException (MethodArgumentNotValidException ex) {
    // Aquí puedes procesar la excepción y devolver una respuesta personalizada
    BindingResult result = ex.getBindingResult();
    FieldError error = result.getFieldError();
    String message = "Error desconocido";
    if (error != null) {
      message = error.getField() + ": " + error.getDefaultMessage();
    }
    return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
  }
}
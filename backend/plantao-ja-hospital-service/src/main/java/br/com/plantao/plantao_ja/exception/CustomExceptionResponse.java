package br.com.plantao.plantao_ja.exception;


import java.util.Date;

public record CustomExceptionResponse(Date timestamp, String message, String details) {
}

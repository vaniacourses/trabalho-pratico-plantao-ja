package br.com.plantao.plantao_ja.exception;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(org.springframework.http.HttpStatus.NOT_FOUND)
public class ObjetoNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ObjetoNotFoundException(String message) {
        super(message);
    }

}

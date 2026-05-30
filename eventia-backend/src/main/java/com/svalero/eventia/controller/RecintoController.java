package com.svalero.eventia.controller;

import com.svalero.eventia.domain.Recinto;
import com.svalero.eventia.exception.ErrorResponse;
import com.svalero.eventia.exception.RecintoNotFoundException;
import com.svalero.eventia.service.RecintoService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recintos")
public class RecintoController {

    @Autowired
    private RecintoService recintoService;

    private final Logger logger = LoggerFactory.getLogger(RecintoController.class);

    @GetMapping
    public ResponseEntity<List<Recinto>> getAllRecintos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String ciudad,
            @RequestParam(required = false) String provincia,
            @RequestParam(required = false) Integer aforoMinimo) {

        logger.info("GET /recintos - filtros nombre={}, ciudad={}, provincia={}, aforoMinimo={}",
                nombre, ciudad, provincia, aforoMinimo);

        return ResponseEntity.ok(recintoService.findAll(nombre, ciudad, provincia, aforoMinimo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recinto> getRecinto(@PathVariable long id) throws RecintoNotFoundException {
        logger.info("GET /recintos/{}", id);
        return ResponseEntity.ok(recintoService.findById(id));
    }

    @GetMapping("/place/{googlePlaceId}")
    public ResponseEntity<Recinto> getByGooglePlaceId(@PathVariable String googlePlaceId) throws RecintoNotFoundException {
        logger.info("GET /recintos/place/{}", googlePlaceId);
        return ResponseEntity.ok(recintoService.findByGooglePlaceId(googlePlaceId));
    }

    @PostMapping
    public ResponseEntity<Recinto> addRecinto(@Valid @RequestBody Recinto recinto) {
        logger.info("POST /recintos");
        return new ResponseEntity<>(recintoService.add(recinto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recinto> modifyRecinto(@PathVariable long id,
                                                 @Valid @RequestBody Recinto recinto) throws RecintoNotFoundException {
        logger.info("PUT /recintos/{}", id);
        return ResponseEntity.ok(recintoService.modify(id, recinto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Recinto> patchRecinto(@PathVariable long id,
                                                @RequestBody Map<String, Object> updates) throws RecintoNotFoundException {
        logger.info("PATCH /recintos/{}", id);
        return ResponseEntity.ok(recintoService.patch(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecinto(@PathVariable long id) throws RecintoNotFoundException {
        logger.info("DELETE /recintos/{}", id);
        recintoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(RecintoNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleException(RecintoNotFoundException rnfe) {
        logger.error("Error 404 - recinto no encontrado: {}", rnfe.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(rnfe.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleException(MethodArgumentNotValidException manve) {
        logger.error("Error 400 - Error de validación", manve);

        Map<String, String> errors = new HashMap<>();
        manve.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        return new ResponseEntity<>(ErrorResponse.validationError(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        logger.error("Error 500 - error interno del servidor", e);
        return new ResponseEntity<>(
                ErrorResponse.generalError(500, "internal-server-error", "Error interno del servidor"),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
package com.svalero.eventia.controller;

import com.svalero.eventia.domain.Usuario;
import com.svalero.eventia.domain.enums.RolUsuario;
import com.svalero.eventia.exception.ErrorResponse;
import com.svalero.eventia.exception.UsuarioNotFoundException;
import com.svalero.eventia.service.UsuarioService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    private final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) RolUsuario rol,
            @RequestParam(required = false) Boolean activo) {

        logger.info("GET /usuarios - filtros nombre={}, email={}, rol={}, activo={}",
                nombre, email, rol, activo);

        return ResponseEntity.ok(usuarioService.findAll(nombre, email, rol, activo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuario(@PathVariable long id) throws UsuarioNotFoundException {
        logger.info("GET /usuarios/{}", id);
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> getByEmail(@PathVariable String email) throws UsuarioNotFoundException {
        logger.info("GET /usuarios/email/{}", email);
        return ResponseEntity.ok(usuarioService.findByEmail(email));
    }

    @GetMapping("/registro")
    public ResponseEntity<List<Usuario>> getByFechaRegistro(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        logger.info("GET /usuarios/registro - desde={}, hasta={}", desde, hasta);
        return ResponseEntity.ok(usuarioService.findByFechaRegistroBetween(desde, hasta));
    }

    @PostMapping
    public ResponseEntity<Usuario> addUsuario(@Valid @RequestBody Usuario usuario) {
        logger.info("POST /usuarios");
        return new ResponseEntity<>(usuarioService.add(usuario), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> modifyUsuario(@PathVariable long id,
                                                 @Valid @RequestBody Usuario usuario) throws UsuarioNotFoundException {
        logger.info("PUT /usuarios/{}", id);
        return ResponseEntity.ok(usuarioService.modify(id, usuario));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Usuario> patchUsuario(@PathVariable long id,
                                                @RequestBody Map<String, Object> updates) throws UsuarioNotFoundException {
        logger.info("PATCH /usuarios/{}", id);
        return ResponseEntity.ok(usuarioService.patch(id, updates));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Usuario> cambiarEstado(@PathVariable long id,
                                                 @RequestParam boolean activo) throws UsuarioNotFoundException {
        logger.info("PATCH /usuarios/{}/estado?activo={}", id, activo);
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, activo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable long id) throws UsuarioNotFoundException {
        logger.info("DELETE /usuarios/{}", id);
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(UsuarioNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleException(UsuarioNotFoundException unfe) {
        logger.error("Error 404 - usuario no encontrado: {}", unfe.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(unfe.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleException(IllegalArgumentException iae) {
        logger.error("Error 409 - conflicto: {}", iae.getMessage());
        return new ResponseEntity<>(
                ErrorResponse.generalError(409, "conflict", iae.getMessage()),
                HttpStatus.CONFLICT
        );
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
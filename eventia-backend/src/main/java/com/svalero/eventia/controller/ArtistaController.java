package com.svalero.eventia.controller;

import com.svalero.eventia.domain.Artista;
import com.svalero.eventia.exception.ArtistaNotFoundException;
import com.svalero.eventia.exception.ErrorResponse;
import com.svalero.eventia.service.ArtistaService;
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
@RequestMapping("/artistas")
public class ArtistaController {

    @Autowired
    private ArtistaService artistaService;

    private final Logger logger = LoggerFactory.getLogger(ArtistaController.class);

    @GetMapping
    public ResponseEntity<List<Artista>> getAllArtistas(
            @RequestParam(required = false) String nombreArtistico,
            @RequestParam(required = false) String generoMusical,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) Float cacheMinimo,
            @RequestParam(required = false) Float cacheMaximo) {

        logger.info("GET /artistas - filtros nombreArtistico={}, generoMusical={}, activo={}, cacheMinimo={}, cacheMaximo={}",
                nombreArtistico, generoMusical, activo, cacheMinimo, cacheMaximo);

        List<Artista> artistas = artistaService.findAll(nombreArtistico, generoMusical, activo, cacheMinimo, cacheMaximo);
        return ResponseEntity.ok(artistas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artista> getArtista(@PathVariable long id) throws ArtistaNotFoundException {
        logger.info("GET /artistas/{}", id);
        return ResponseEntity.ok(artistaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Artista> addArtista(@Valid @RequestBody Artista artista) {
        logger.info("POST /artistas");
        return new ResponseEntity<>(artistaService.add(artista), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artista> modifyArtista(@PathVariable long id,
                                                 @Valid @RequestBody Artista artista) throws ArtistaNotFoundException {
        logger.info("PUT /artistas/{}", id);
        return ResponseEntity.ok(artistaService.modify(id, artista));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Artista> patchArtista(@PathVariable long id,
                                                @RequestBody Map<String, Object> updates) throws ArtistaNotFoundException {
        logger.info("PATCH /artistas/{}", id);
        return ResponseEntity.ok(artistaService.patch(id, updates));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Artista> cambiarEstado(@PathVariable long id,
                                                 @RequestParam boolean activo) throws ArtistaNotFoundException {
        logger.info("PATCH /artistas/{}/estado?activo={}", id, activo);
        return ResponseEntity.ok(artistaService.cambiarEstado(id, activo));
    }

    @PatchMapping("/{id}/eventos-realizados")
    public ResponseEntity<Artista> incrementarEventosRealizados(@PathVariable long id) throws ArtistaNotFoundException {
        logger.info("PATCH /artistas/{}/eventos-realizados", id);
        return ResponseEntity.ok(artistaService.incrementarEventosRealizados(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtista(@PathVariable long id) throws ArtistaNotFoundException {
        logger.info("DELETE /artistas/{}", id);
        artistaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ArtistaNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleException(ArtistaNotFoundException anfe) {
        logger.error("Error 404 - artista no encontrado: {}", anfe.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(anfe.getMessage()), HttpStatus.NOT_FOUND);
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
package com.svalero.eventia.controller;

import com.svalero.eventia.domain.Evento;
import com.svalero.eventia.domain.enums.EstadoEvento;
import com.svalero.eventia.domain.enums.TipoEvento;
import com.svalero.eventia.exception.*;
import com.svalero.eventia.service.EventoService;
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
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    private final Logger logger = LoggerFactory.getLogger(EventoController.class);

    @GetMapping
    public ResponseEntity<List<Evento>> getAllEventos(
            @RequestParam(required = false) EstadoEvento estado,
            @RequestParam(required = false) TipoEvento tipoEvento,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long recintoId,
            @RequestParam(required = false) Long organizadorId,
            @RequestParam(required = false) Float precioMaximo,
            @RequestParam(required = false) Float precioMinimo,
            @RequestParam(required = false) Float precioMaximoRango,
            @RequestParam(required = false) Integer edadPermitida,
            @RequestParam(required = false) Boolean proximos,
            @RequestParam(required = false) Boolean conEntradas) {

        logger.info("GET /eventos - filtros estado={}, tipoEvento={}, nombre={}, recintoId={}, organizadorId={}",
                estado, tipoEvento, nombre, recintoId, organizadorId);

        if (estado != null && tipoEvento != null) {
            return ResponseEntity.ok(eventoService.findByEstadoAndTipo(estado, tipoEvento));
        }

        if (recintoId != null && estado != null) {
            return ResponseEntity.ok(eventoService.findByRecintoYEstado(recintoId, estado));
        }

        if (precioMinimo != null && precioMaximoRango != null) {
            return ResponseEntity.ok(eventoService.findByRangoPrecio(precioMinimo, precioMaximoRango));
        }

        if (estado != null) {
            return ResponseEntity.ok(eventoService.findByEstado(estado));
        }

        if (tipoEvento != null) {
            return ResponseEntity.ok(eventoService.findByTipoEvento(tipoEvento));
        }

        if (nombre != null) {
            return ResponseEntity.ok(eventoService.findByNombre(nombre));
        }

        if (recintoId != null) {
            return ResponseEntity.ok(eventoService.findByRecinto(recintoId));
        }

        if (organizadorId != null) {
            return ResponseEntity.ok(eventoService.findByOrganizador(organizadorId));
        }

        if (precioMaximo != null) {
            return ResponseEntity.ok(eventoService.findByPrecioMaximo(precioMaximo));
        }

        if (edadPermitida != null) {
            return ResponseEntity.ok(eventoService.findByEdadPermitida(edadPermitida));
        }

        if (Boolean.TRUE.equals(proximos)) {
            return ResponseEntity.ok(eventoService.findProximos());
        }

        if (Boolean.TRUE.equals(conEntradas)) {
            return ResponseEntity.ok(eventoService.findConEntradasDisponibles());
        }

        return ResponseEntity.ok(eventoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evento> getEvento(@PathVariable long id) throws EventoNotFoundException {
        logger.info("GET /eventos/{}", id);
        return ResponseEntity.ok(eventoService.findById(id));
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<Evento>> getByFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        logger.info("GET /eventos/fechas - desde={}, hasta={}", desde, hasta);
        return ResponseEntity.ok(eventoService.findByFechas(desde, hasta));
    }

    @GetMapping("/artista/{artistaId}")
    public ResponseEntity<List<Evento>> getByArtista(@PathVariable long artistaId) {
        logger.info("GET /eventos/artista/{}", artistaId);
        return ResponseEntity.ok(eventoService.findByArtista(artistaId));
    }

    @PostMapping
    public ResponseEntity<Evento> addEvento(@Valid @RequestBody Evento evento)
            throws RecintoNotFoundException, UsuarioNotFoundException {

        logger.info("POST /eventos");
        return new ResponseEntity<>(eventoService.add(evento), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> modifyEvento(@PathVariable long id,
                                               @Valid @RequestBody Evento evento) throws EventoNotFoundException {
        logger.info("PUT /eventos/{}", id);
        return ResponseEntity.ok(eventoService.modify(id, evento));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Evento> patchEvento(@PathVariable long id,
                                              @RequestBody Map<String, Object> updates) throws EventoNotFoundException {
        logger.info("PATCH /eventos/{}", id);
        return ResponseEntity.ok(eventoService.patch(id, updates));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Evento> cambiarEstado(@PathVariable long id,
                                                @RequestParam EstadoEvento estado) throws EventoNotFoundException {
        logger.info("PATCH /eventos/{}/estado?estado={}", id, estado);
        return ResponseEntity.ok(eventoService.cambiarEstado(id, estado));
    }

    @PostMapping("/{eventoId}/artistas/{artistaId}")
    public ResponseEntity<Evento> agregarArtista(@PathVariable long eventoId,
                                                 @PathVariable long artistaId)
            throws EventoNotFoundException, ArtistaNotFoundException {

        logger.info("POST /eventos/{}/artistas/{}", eventoId, artistaId);
        return ResponseEntity.ok(eventoService.agregarArtista(eventoId, artistaId));
    }

    @DeleteMapping("/{eventoId}/artistas/{artistaId}")
    public ResponseEntity<Evento> eliminarArtista(@PathVariable long eventoId,
                                                  @PathVariable long artistaId) throws EventoNotFoundException {
        logger.info("DELETE /eventos/{}/artistas/{}", eventoId, artistaId);
        return ResponseEntity.ok(eventoService.eliminarArtista(eventoId, artistaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable long id) throws EventoNotFoundException {
        logger.info("DELETE /eventos/{}", id);
        eventoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(EventoNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleException(EventoNotFoundException enfe) {
        logger.error("Error 404 - evento no encontrado: {}", enfe.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(enfe.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({RecintoNotFoundException.class, UsuarioNotFoundException.class, ArtistaNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleRelatedNotFoundException(Exception e) {
        logger.error("Error 404 - entidad relacionada no encontrada: {}", e.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(e.getMessage()), HttpStatus.NOT_FOUND);
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
package com.svalero.eventia.controller;

import com.svalero.eventia.domain.Reserva;
import com.svalero.eventia.domain.enums.EstadoReserva;
import com.svalero.eventia.exception.*;
import com.svalero.eventia.service.ReservaService;
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
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    private final Logger logger = LoggerFactory.getLogger(ReservaController.class);

    @GetMapping
    public ResponseEntity<List<Reserva>> getAllReservas(
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false) Long eventoId,
            @RequestParam(required = false) EstadoReserva estado) {

        logger.info("GET /reservas - filtros usuarioId={}, eventoId={}, estado={}", usuarioId, eventoId, estado);

        if (usuarioId != null && estado != null) {
            return ResponseEntity.ok(reservaService.findByUsuarioAndEstado(usuarioId, estado));
        }

        if (eventoId != null && estado != null) {
            return ResponseEntity.ok(reservaService.findByEventoAndEstado(eventoId, estado));
        }

        if (usuarioId != null) {
            return ResponseEntity.ok(reservaService.findByUsuario(usuarioId));
        }

        if (eventoId != null) {
            return ResponseEntity.ok(reservaService.findByEvento(eventoId));
        }

        if (estado != null) {
            return ResponseEntity.ok(reservaService.findByEstado(estado));
        }

        return ResponseEntity.ok(reservaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReserva(@PathVariable long id) throws ReservaNotFoundException {
        logger.info("GET /reservas/{}", id);
        return ResponseEntity.ok(reservaService.findById(id));
    }

    @GetMapping("/codigo/{codigoReserva}")
    public ResponseEntity<Reserva> getByCodigoReserva(@PathVariable String codigoReserva) throws ReservaNotFoundException {
        logger.info("GET /reservas/codigo/{}", codigoReserva);
        return ResponseEntity.ok(reservaService.findByCodigoReserva(codigoReserva));
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<Reserva>> getByFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta) {

        logger.info("GET /reservas/fechas - desde={}, hasta={}", desde, hasta);
        return ResponseEntity.ok(reservaService.findByFechas(desde, hasta));
    }

    @GetMapping("/evento/{eventoId}/total")
    public ResponseEntity<Long> countByEvento(@PathVariable long eventoId) {
        logger.info("GET /reservas/evento/{}/total", eventoId);
        return ResponseEntity.ok(reservaService.countByEvento(eventoId));
    }

    @GetMapping("/evento/{eventoId}/confirmadas/total")
    public ResponseEntity<Long> countConfirmadasByEvento(@PathVariable long eventoId) {
        logger.info("GET /reservas/evento/{}/confirmadas/total", eventoId);
        return ResponseEntity.ok(reservaService.countConfirmadasByEvento(eventoId));
    }

    @PostMapping
    public ResponseEntity<Reserva> addReserva(@Valid @RequestBody Reserva reserva)
            throws UsuarioNotFoundException, EventoNotFoundException {

        logger.info("POST /reservas");
        return new ResponseEntity<>(reservaService.add(reserva), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reserva> modifyReserva(@PathVariable long id,
                                                 @Valid @RequestBody Reserva reserva) throws ReservaNotFoundException {
        logger.info("PUT /reservas/{}", id);
        return ResponseEntity.ok(reservaService.modify(id, reserva));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Reserva> patchReserva(@PathVariable long id,
                                                @RequestBody Map<String, Object> updates) throws ReservaNotFoundException {
        logger.info("PATCH /reservas/{}", id);
        return ResponseEntity.ok(reservaService.patch(id, updates));
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable long id) throws ReservaNotFoundException {
        logger.info("PATCH /reservas/{}/confirmar", id);
        return ResponseEntity.ok(reservaService.confirmar(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Reserva> cancelarReserva(@PathVariable long id) throws ReservaNotFoundException {
        logger.info("PATCH /reservas/{}/cancelar", id);
        return ResponseEntity.ok(reservaService.cancelar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable long id) throws ReservaNotFoundException {
        logger.info("DELETE /reservas/{}", id);
        reservaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ReservaNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleException(ReservaNotFoundException rnfe) {
        logger.error("Error 404 - reserva no encontrada: {}", rnfe.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(rnfe.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({UsuarioNotFoundException.class, EventoNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleRelatedNotFoundException(Exception e) {
        logger.error("Error 404 - entidad relacionada no encontrada: {}", e.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ErrorResponse> handleBusinessException(RuntimeException e) {
        logger.error("Error 400 - regla de negocio incumplida: {}", e.getMessage());
        return new ResponseEntity<>(
                ErrorResponse.generalError(400, "business-rule-error", e.getMessage()),
                HttpStatus.BAD_REQUEST
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
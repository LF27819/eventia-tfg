package com.svalero.eventia.controller;

import com.svalero.eventia.domain.Entrada;
import com.svalero.eventia.domain.enums.EstadoEntrada;
import com.svalero.eventia.domain.enums.TipoEntrada;
import com.svalero.eventia.exception.EntradaNotFoundException;
import com.svalero.eventia.exception.ErrorResponse;
import com.svalero.eventia.service.EntradaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.svalero.eventia.service.PdfEntradaService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/entradas")
public class EntradaController {

    @Autowired
    private EntradaService entradaService;

    @Autowired
    private PdfEntradaService pdfEntradaService;

    private final Logger logger = LoggerFactory.getLogger(EntradaController.class);

    @GetMapping
    public ResponseEntity<List<Entrada>> getAllEntradas(
            @RequestParam(required = false) Long reservaId,
            @RequestParam(required = false) Long eventoId,
            @RequestParam(required = false) EstadoEntrada estado,
            @RequestParam(required = false) TipoEntrada tipoEntrada) {

        logger.info("GET /entradas - filtros reservaId={}, eventoId={}, estado={}, tipoEntrada={}",
                reservaId, eventoId, estado, tipoEntrada);

        if (eventoId != null && estado != null) {
            return ResponseEntity.ok(entradaService.findByEventoAndEstado(eventoId, estado));
        }

        if (eventoId != null && tipoEntrada != null) {
            return ResponseEntity.ok(entradaService.findByEventoAndTipo(eventoId, tipoEntrada));
        }

        if (reservaId != null && estado != null) {
            return ResponseEntity.ok(entradaService.findByReservaAndEstado(reservaId, estado));
        }

        if (reservaId != null) {
            return ResponseEntity.ok(entradaService.findByReserva(reservaId));
        }

        if (eventoId != null) {
            return ResponseEntity.ok(entradaService.findByEvento(eventoId));
        }

        if (estado != null) {
            return ResponseEntity.ok(entradaService.findByEstado(estado));
        }

        if (tipoEntrada != null) {
            return ResponseEntity.ok(entradaService.findByTipoEntrada(tipoEntrada));
        }

        return ResponseEntity.ok(entradaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entrada> getEntrada(@PathVariable long id) throws EntradaNotFoundException {
        logger.info("GET /entradas/{}", id);
        return ResponseEntity.ok(entradaService.findById(id));
    }

    @GetMapping("/qr/{codigoQr}")
    public ResponseEntity<Entrada> getByCodigoQr(@PathVariable String codigoQr) throws EntradaNotFoundException {
        logger.info("GET /entradas/qr/{}", codigoQr);
        return ResponseEntity.ok(entradaService.findByCodigoQr(codigoQr));
    }

    @GetMapping("/evento/{eventoId}/estado/{estado}/total")
    public ResponseEntity<Long> countByEventoAndEstado(@PathVariable long eventoId,
                                                       @PathVariable EstadoEntrada estado) {
        logger.info("GET /entradas/evento/{}/estado/{}/total", eventoId, estado);
        return ResponseEntity.ok(entradaService.countByEventoAndEstado(eventoId, estado));
    }

    //GET para PDF
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdfEntrada(@PathVariable long id)
            throws EntradaNotFoundException {

        Entrada entrada = entradaService.findById(id);

        byte[] pdf = pdfEntradaService.generarPdfEntrada(entrada);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=entrada-eventia-" + entrada.getId() + ".pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @PatchMapping("/validar/{codigoQr}")
    public ResponseEntity<Entrada> validarEntrada(@PathVariable String codigoQr) throws EntradaNotFoundException {
        logger.info("PATCH /entradas/validar/{}", codigoQr);
        return ResponseEntity.ok(entradaService.validarEntrada(codigoQr));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Entrada> cancelarEntrada(@PathVariable long id) throws EntradaNotFoundException {
        logger.info("PATCH /entradas/{}/cancelar", id);
        return ResponseEntity.ok(entradaService.cancelarEntrada(id));
    }

    @PatchMapping("/{id}/tipo")
    public ResponseEntity<Entrada> actualizarTipo(@PathVariable long id,
                                                  @RequestParam TipoEntrada tipoEntrada,
                                                  @RequestParam float precio) throws EntradaNotFoundException {
        logger.info("PATCH /entradas/{}/tipo?tipoEntrada={}&precio={}", id, tipoEntrada, precio);
        return ResponseEntity.ok(entradaService.actualizarTipo(id, tipoEntrada, precio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntrada(@PathVariable long id) throws EntradaNotFoundException {
        logger.info("DELETE /entradas/{}", id);
        entradaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(EntradaNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleException(EntradaNotFoundException enfe) {
        logger.error("Error 404 - entrada no encontrada: {}", enfe.getMessage());
        return new ResponseEntity<>(ErrorResponse.notFound(enfe.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(IllegalStateException ise) {
        logger.error("Error 400 - regla de negocio incumplida: {}", ise.getMessage());
        return new ResponseEntity<>(
                ErrorResponse.generalError(400, "business-rule-error", ise.getMessage()),
                HttpStatus.BAD_REQUEST
        );
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
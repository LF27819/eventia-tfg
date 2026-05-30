package com.svalero.eventia.service;

import com.svalero.eventia.domain.Entrada;
import com.svalero.eventia.domain.enums.EstadoEntrada;
import com.svalero.eventia.domain.enums.TipoEntrada;
import com.svalero.eventia.exception.EntradaNotFoundException;
import com.svalero.eventia.repository.EntradaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EntradaService {

    @Autowired
    private EntradaRepository entradaRepository;

    public List<Entrada> findAll() {
        return entradaRepository.findAll();
    }

    public Entrada findById(long id) throws EntradaNotFoundException {
        return entradaRepository.findById(id)
                .orElseThrow(EntradaNotFoundException::new);
    }

    public Entrada findByCodigoQr(String codigoQr) throws EntradaNotFoundException {
        return entradaRepository.findByCodigoQr(codigoQr)
                .orElseThrow(EntradaNotFoundException::new);
    }

    public List<Entrada> findByReserva(long reservaId) {
        return entradaRepository.findByReservaId(reservaId);
    }

    public List<Entrada> findByEvento(long eventoId) {
        return entradaRepository.findByEventoId(eventoId);
    }

    public List<Entrada> findByEstado(EstadoEntrada estado) {
        return entradaRepository.findByEstado(estado);
    }

    public List<Entrada> findByTipoEntrada(TipoEntrada tipoEntrada) {
        return entradaRepository.findByTipoEntrada(tipoEntrada);
    }

    public List<Entrada> findByEventoAndEstado(long eventoId, EstadoEntrada estado) {
        return entradaRepository.findByEventoIdAndEstado(eventoId, estado);
    }

    public List<Entrada> findByEventoAndTipo(long eventoId, TipoEntrada tipoEntrada) {
        return entradaRepository.findByEventoIdAndTipoEntrada(eventoId, tipoEntrada);
    }

    public List<Entrada> findByReservaAndEstado(long reservaId, EstadoEntrada estado) {
        return entradaRepository.findByReservaIdAndEstado(reservaId, estado);
    }

    public long countByEventoAndEstado(long eventoId, EstadoEntrada estado) {
        return entradaRepository.countByEventoIdAndEstado(eventoId, estado);
    }

    public Entrada validarEntrada(String codigoQr) throws EntradaNotFoundException {
        Entrada entrada = findByCodigoQr(codigoQr);

        if (entrada.getEstado() == EstadoEntrada.USADA) {
            throw new IllegalStateException("La entrada ya ha sido utilizada");
        }

        if (entrada.getEstado() == EstadoEntrada.CANCELADA) {
            throw new IllegalStateException("La entrada está cancelada");
        }

        entrada.setEstado(EstadoEntrada.USADA);
        entrada.setFechaUso(LocalDateTime.now());

        return entradaRepository.save(entrada);
    }

    public Entrada cancelarEntrada(long id) throws EntradaNotFoundException {
        Entrada entrada = findById(id);

        if (entrada.getEstado() == EstadoEntrada.USADA) {
            throw new IllegalStateException("No se puede cancelar una entrada ya usada");
        }

        entrada.setEstado(EstadoEntrada.CANCELADA);
        return entradaRepository.save(entrada);
    }

    public Entrada actualizarTipo(long id, TipoEntrada tipoEntrada, float nuevoPrecio) throws EntradaNotFoundException {
        Entrada entrada = findById(id);

        if (entrada.getEstado() != EstadoEntrada.VALIDA) {
            throw new IllegalStateException("Solo se puede actualizar el tipo de entradas válidas");
        }

        entrada.setTipoEntrada(tipoEntrada);
        entrada.setPrecio(nuevoPrecio);

        return entradaRepository.save(entrada);
    }

    public void delete(long id) throws EntradaNotFoundException {
        Entrada entrada = entradaRepository.findById(id)
                .orElseThrow(EntradaNotFoundException::new);

        entradaRepository.delete(entrada);
    }
}
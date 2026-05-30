package com.svalero.eventia.repository;

import com.svalero.eventia.domain.Entrada;
import com.svalero.eventia.domain.enums.EstadoEntrada;
import com.svalero.eventia.domain.enums.TipoEntrada;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface EntradaRepository extends CrudRepository<Entrada, Long> {

    List<Entrada> findAll();

    Optional<Entrada> findByCodigoQr(String codigoQr);

    List<Entrada> findByReservaId(long reservaId);

    List<Entrada> findByEventoId(long eventoId);

    List<Entrada> findByEstado(EstadoEntrada estado);

    List<Entrada> findByTipoEntrada(TipoEntrada tipoEntrada);

    List<Entrada> findByEventoIdAndEstado(long eventoId, EstadoEntrada estado);

    List<Entrada> findByEventoIdAndTipoEntrada(long eventoId, TipoEntrada tipoEntrada);

    List<Entrada> findByReservaIdAndEstado(long reservaId, EstadoEntrada estado);

    long countByEventoIdAndEstado(long eventoId, EstadoEntrada estado);

    boolean existsByCodigoQr(String codigoQr);
}
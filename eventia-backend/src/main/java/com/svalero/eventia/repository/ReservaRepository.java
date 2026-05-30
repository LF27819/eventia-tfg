package com.svalero.eventia.repository;

import com.svalero.eventia.domain.Reserva;
import com.svalero.eventia.domain.enums.EstadoReserva;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends CrudRepository<Reserva, Long> {

    List<Reserva> findAll();

    Optional<Reserva> findByCodigoReserva(String codigoReserva);

    List<Reserva> findByUsuarioId(long usuarioId);

    List<Reserva> findByEventoId(long eventoId);

    List<Reserva> findByEstado(EstadoReserva estado);

    List<Reserva> findByUsuarioIdAndEstado(long usuarioId, EstadoReserva estado);

    List<Reserva> findByEventoIdAndEstado(long eventoId, EstadoReserva estado);

    List<Reserva> findByFechaReservaBetween(LocalDateTime desde, LocalDateTime hasta);

    long countByEventoId(long eventoId);

    long countByEventoIdAndEstado(long eventoId, EstadoReserva estado);

    boolean existsByCodigoReserva(String codigoReserva);
}
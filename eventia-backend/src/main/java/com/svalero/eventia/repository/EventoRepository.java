package com.svalero.eventia.repository;

import com.svalero.eventia.domain.Evento;
import com.svalero.eventia.domain.enums.EstadoEvento;
import com.svalero.eventia.domain.enums.TipoEvento;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventoRepository extends CrudRepository<Evento, Long> {

    List<Evento> findAll();

    List<Evento> findByEstado(EstadoEvento estado);

    List<Evento> findByTipoEvento(TipoEvento tipoEvento);

    List<Evento> findByNombreContainingIgnoreCase(String nombre);

    List<Evento> findByRecintoId(long recintoId);

    List<Evento> findByOrganizadorId(long organizadorId);

    List<Evento> findByFechaInicioBetween(LocalDateTime desde, LocalDateTime hasta);

    List<Evento> findByFechaInicioAfter(LocalDateTime fecha);

    List<Evento> findByEstadoAndTipoEvento(EstadoEvento estado, TipoEvento tipoEvento);

    List<Evento> findByEntradasDisponiblesGreaterThan(int minimo);

    List<Evento> findByPrecioBaseLessThanEqual(float precioMaximo);

    List<Evento> findByPrecioBaseBetween(float precioMinimo, float precioMaximo);

    List<Evento> findByEdadMinimaLessThanEqual(int edad);

    List<Evento> findByArtistasId(long artistaId);

    List<Evento> findByRecintoIdAndEstado(long recintoId, EstadoEvento estado);
}
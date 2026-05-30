package com.svalero.eventia.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.svalero.eventia.domain.Artista;
import com.svalero.eventia.domain.Evento;
import com.svalero.eventia.domain.Recinto;
import com.svalero.eventia.domain.Usuario;
import com.svalero.eventia.domain.enums.EstadoEvento;
import com.svalero.eventia.domain.enums.TipoEvento;
import com.svalero.eventia.exception.ArtistaNotFoundException;
import com.svalero.eventia.exception.EventoNotFoundException;
import com.svalero.eventia.exception.RecintoNotFoundException;
import com.svalero.eventia.exception.UsuarioNotFoundException;
import com.svalero.eventia.repository.ArtistaRepository;
import com.svalero.eventia.repository.EventoRepository;
import com.svalero.eventia.repository.RecintoRepository;
import com.svalero.eventia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private RecintoRepository recintoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ArtistaRepository artistaRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    public Evento findById(Long id) throws EventoNotFoundException {
        return eventoRepository.findById(id)
                .orElseThrow(EventoNotFoundException::new);
    }

    public List<Evento> findByEstado(EstadoEvento estado) {
        return eventoRepository.findByEstado(estado);
    }

    public List<Evento> findByTipoEvento(TipoEvento tipoEvento) {
        return eventoRepository.findByTipoEvento(tipoEvento);
    }

    public List<Evento> findByNombre(String nombre) {
        return eventoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Evento> findByRecinto(long recintoId) {
        return eventoRepository.findByRecintoId(recintoId);
    }

    public List<Evento> findByOrganizador(long organizadorId) {
        return eventoRepository.findByOrganizadorId(organizadorId);
    }

    public List<Evento> findByFechas(LocalDateTime desde, LocalDateTime hasta) {
        return eventoRepository.findByFechaInicioBetween(desde, hasta);
    }

    public List<Evento> findProximos() {
        return eventoRepository.findByFechaInicioAfter(LocalDateTime.now());
    }

    public List<Evento> findByEstadoAndTipo(EstadoEvento estado, TipoEvento tipoEvento) {
        return eventoRepository.findByEstadoAndTipoEvento(estado, tipoEvento);
    }

    public List<Evento> findConEntradasDisponibles() {
        return eventoRepository.findByEntradasDisponiblesGreaterThan(0);
    }

    public List<Evento> findByPrecioMaximo(float precioMaximo) {
        return eventoRepository.findByPrecioBaseLessThanEqual(precioMaximo);
    }

    public List<Evento> findByRangoPrecio(float precioMinimo, float precioMaximo) {
        return eventoRepository.findByPrecioBaseBetween(precioMinimo, precioMaximo);
    }

    public List<Evento> findByEdadPermitida(int edad) {
        return eventoRepository.findByEdadMinimaLessThanEqual(edad);
    }

    public List<Evento> findByArtista(long artistaId) {
        return eventoRepository.findByArtistasId(artistaId);
    }

    public List<Evento> findByRecintoYEstado(long recintoId, EstadoEvento estado) {
        return eventoRepository.findByRecintoIdAndEstado(recintoId, estado);
    }

    public Evento add(Evento evento) throws RecintoNotFoundException, UsuarioNotFoundException {
        Recinto recinto = recintoRepository.findById(evento.getRecinto().getId())
                .orElseThrow(RecintoNotFoundException::new);

        Usuario organizador = usuarioRepository.findById(evento.getOrganizador().getId())
                .orElseThrow(UsuarioNotFoundException::new);

        evento.setRecinto(recinto);
        evento.setOrganizador(organizador);
        evento.setEstado(EstadoEvento.BORRADOR);
        evento.setEntradasDisponibles(evento.getAforoTotal());

        return eventoRepository.save(evento);
    }

    public Evento modify(Long id, Evento nuevoEvento) throws EventoNotFoundException {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(EventoNotFoundException::new);

        evento.setNombre(nuevoEvento.getNombre());
        evento.setDescripcion(nuevoEvento.getDescripcion());
        evento.setTipoEvento(nuevoEvento.getTipoEvento());
        evento.setFechaInicio(nuevoEvento.getFechaInicio());
        evento.setFechaFin(nuevoEvento.getFechaFin());
        evento.setPrecioBase(nuevoEvento.getPrecioBase());
        evento.setAforoTotal(nuevoEvento.getAforoTotal());
        evento.setEdadMinima(nuevoEvento.getEdadMinima());
        evento.setEntradasDisponibles(nuevoEvento.getEntradasDisponibles());
        evento.setEstado(nuevoEvento.getEstado());
        evento.setImagenUrl(nuevoEvento.getImagenUrl());
        evento.setRecinto(nuevoEvento.getRecinto());
        evento.setOrganizador(nuevoEvento.getOrganizador());
        evento.setArtistas(nuevoEvento.getArtistas());

        return eventoRepository.save(evento);
    }

    public Evento patch(long id, Map<String, Object> updates) throws EventoNotFoundException {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(EventoNotFoundException::new);

        updates.forEach((key, value) -> {
            if (key.equals("id")) {
                return;
            }

            Field field = ReflectionUtils.findField(Evento.class, key);
            if (field != null) {
                field.setAccessible(true);
                Object convertedValue = objectMapper.convertValue(value, field.getType());
                ReflectionUtils.setField(field, evento, convertedValue);
            }
        });

        return eventoRepository.save(evento);
    }

    public Evento cambiarEstado(long id, EstadoEvento estado) throws EventoNotFoundException {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(EventoNotFoundException::new);

        evento.setEstado(estado);
        return eventoRepository.save(evento);
    }

    public Evento agregarArtista(long eventoId, long artistaId) throws EventoNotFoundException, ArtistaNotFoundException {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(EventoNotFoundException::new);

        Artista artista = artistaRepository.findById(artistaId)
                .orElseThrow(ArtistaNotFoundException::new);

        if (!evento.getArtistas().contains(artista)) {
            evento.getArtistas().add(artista);
        }

        return eventoRepository.save(evento);
    }

    public Evento eliminarArtista(long eventoId, long artistaId) throws EventoNotFoundException {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(EventoNotFoundException::new);

        evento.getArtistas().removeIf(artista -> artista.getId() == artistaId);

        return eventoRepository.save(evento);
    }

    public void delete(Long id) throws EventoNotFoundException {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(EventoNotFoundException::new);

        eventoRepository.delete(evento);
    }
}
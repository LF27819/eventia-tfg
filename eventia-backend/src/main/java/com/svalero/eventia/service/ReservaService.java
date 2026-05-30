package com.svalero.eventia.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.svalero.eventia.domain.Entrada;
import com.svalero.eventia.domain.Evento;
import com.svalero.eventia.domain.Reserva;
import com.svalero.eventia.domain.Usuario;
import com.svalero.eventia.domain.enums.EstadoEntrada;
import com.svalero.eventia.domain.enums.EstadoEvento;
import com.svalero.eventia.domain.enums.EstadoReserva;
import com.svalero.eventia.domain.enums.TipoEntrada;
import com.svalero.eventia.exception.EventoNotFoundException;
import com.svalero.eventia.exception.ReservaNotFoundException;
import com.svalero.eventia.exception.UsuarioNotFoundException;
import com.svalero.eventia.repository.EntradaRepository;
import com.svalero.eventia.repository.EventoRepository;
import com.svalero.eventia.repository.ReservaRepository;
import com.svalero.eventia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private EntradaRepository entradaRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Reserva findById(Long id) throws ReservaNotFoundException {
        return reservaRepository.findById(id)
                .orElseThrow(ReservaNotFoundException::new);
    }

    public Reserva findByCodigoReserva(String codigoReserva) throws ReservaNotFoundException {
        return reservaRepository.findByCodigoReserva(codigoReserva)
                .orElseThrow(ReservaNotFoundException::new);
    }

    public List<Reserva> findByUsuario(long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    public List<Reserva> findByEvento(long eventoId) {
        return reservaRepository.findByEventoId(eventoId);
    }

    public List<Reserva> findByEstado(EstadoReserva estado) {
        return reservaRepository.findByEstado(estado);
    }

    public List<Reserva> findByUsuarioAndEstado(long usuarioId, EstadoReserva estado) {
        return reservaRepository.findByUsuarioIdAndEstado(usuarioId, estado);
    }

    public List<Reserva> findByEventoAndEstado(long eventoId, EstadoReserva estado) {
        return reservaRepository.findByEventoIdAndEstado(eventoId, estado);
    }

    public List<Reserva> findByFechas(LocalDateTime desde, LocalDateTime hasta) {
        return reservaRepository.findByFechaReservaBetween(desde, hasta);
    }

    public long countByEvento(long eventoId) {
        return reservaRepository.countByEventoId(eventoId);
    }

    public long countConfirmadasByEvento(long eventoId) {
        return reservaRepository.countByEventoIdAndEstado(eventoId, EstadoReserva.CONFIRMADA);
    }

    public Reserva add(Reserva reserva) throws UsuarioNotFoundException, EventoNotFoundException {
        Usuario usuario = usuarioRepository.findById(reserva.getUsuario().getId())
                .orElseThrow(UsuarioNotFoundException::new);

        Evento evento = eventoRepository.findById(reserva.getEvento().getId())
                .orElseThrow(EventoNotFoundException::new);

        if (evento.getEstado() != EstadoEvento.PUBLICADO) {
            throw new IllegalStateException("Solo se pueden reservar entradas de eventos publicados");
        }

        if (evento.getEntradasDisponibles() < reserva.getCantidadEntradas()) {
            throw new IllegalArgumentException("No hay suficientes entradas disponibles");
        }

        validarEdadUsuario(usuario, evento);

        reserva.setUsuario(usuario);
        reserva.setEvento(evento);
        reserva.setFechaReserva(LocalDateTime.now());
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        reserva.setPrecioTotal(evento.getPrecioBase() * reserva.getCantidadEntradas());
        reserva.setCodigoReserva(generarCodigoReserva());

        evento.setEntradasDisponibles(evento.getEntradasDisponibles() - reserva.getCantidadEntradas());
        eventoRepository.save(evento);

        Reserva reservaGuardada = reservaRepository.save(reserva);

        List<Entrada> entradas = generarEntradas(reservaGuardada, evento);
        entradaRepository.saveAll(entradas);

        reservaGuardada.setEntradas(entradas);

        return reservaGuardada;
    }

    public Reserva modify(Long id, Reserva nuevaReserva) throws ReservaNotFoundException {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(ReservaNotFoundException::new);

        reserva.setFechaReserva(nuevaReserva.getFechaReserva());
        reserva.setCantidadEntradas(nuevaReserva.getCantidadEntradas());
        reserva.setPrecioTotal(nuevaReserva.getPrecioTotal());
        reserva.setEstado(nuevaReserva.getEstado());
        reserva.setCodigoReserva(nuevaReserva.getCodigoReserva());
        reserva.setUsuario(nuevaReserva.getUsuario());
        reserva.setEvento(nuevaReserva.getEvento());

        return reservaRepository.save(reserva);
    }

    public Reserva patch(long id, Map<String, Object> updates) throws ReservaNotFoundException {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(ReservaNotFoundException::new);

        updates.forEach((key, value) -> {
            if (key.equals("id")) {
                return;
            }

            Field field = ReflectionUtils.findField(Reserva.class, key);
            if (field != null) {
                field.setAccessible(true);
                Object convertedValue = objectMapper.convertValue(value, field.getType());
                ReflectionUtils.setField(field, reserva, convertedValue);
            }
        });

        return reservaRepository.save(reserva);
    }

    public Reserva confirmar(long id) throws ReservaNotFoundException {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(ReservaNotFoundException::new);

        if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden confirmar reservas pendientes");
        }

        reserva.setEstado(EstadoReserva.CONFIRMADA);
        return reservaRepository.save(reserva);
    }

    public Reserva cancelar(long id) throws ReservaNotFoundException {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(ReservaNotFoundException::new);

        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new IllegalStateException("La reserva ya está cancelada");
        }

        Evento evento = reserva.getEvento();
        evento.setEntradasDisponibles(evento.getEntradasDisponibles() + reserva.getCantidadEntradas());
        eventoRepository.save(evento);

        if (reserva.getEntradas() != null) {
            reserva.getEntradas().forEach(entrada -> entrada.setEstado(EstadoEntrada.CANCELADA));
            entradaRepository.saveAll(reserva.getEntradas());
        }

        reserva.setEstado(EstadoReserva.CANCELADA);
        return reservaRepository.save(reserva);
    }

    public void delete(Long id) throws ReservaNotFoundException {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(ReservaNotFoundException::new);

        reservaRepository.delete(reserva);
    }

    private void validarEdadUsuario(Usuario usuario, Evento evento) {
        if (evento.getEdadMinima() <= 0) {
            return;
        }

        if (usuario.getFechaNacimiento() == null) {
            throw new IllegalArgumentException("El usuario debe tener fecha de nacimiento para reservar este evento");
        }

        int edad = Period.between(usuario.getFechaNacimiento(), LocalDate.now()).getYears();

        if (edad < evento.getEdadMinima()) {
            throw new IllegalArgumentException("El usuario no cumple la edad mínima para este evento");
        }
    }

    private String generarCodigoReserva() {
        String codigo;

        do {
            codigo = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (reservaRepository.existsByCodigoReserva(codigo));

        return codigo;
    }

    private List<Entrada> generarEntradas(Reserva reserva, Evento evento) {
        List<Entrada> entradas = new ArrayList<>();

        for (int i = 0; i < reserva.getCantidadEntradas(); i++) {
            Entrada entrada = new Entrada();
            entrada.setReserva(reserva);
            entrada.setEvento(evento);
            entrada.setCodigoQr(UUID.randomUUID().toString());
            entrada.setPdfUrl(null);
            entrada.setTipoEntrada(TipoEntrada.GENERAL);
            entrada.setPrecio(evento.getPrecioBase());
            entrada.setEstado(EstadoEntrada.VALIDA);
            entrada.setFechaGeneracion(LocalDateTime.now());
            entrada.setFechaUso(null);

            entradas.add(entrada);
        }

        return entradas;
    }
}
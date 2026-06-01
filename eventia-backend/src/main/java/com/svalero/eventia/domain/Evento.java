package com.svalero.eventia.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.svalero.eventia.domain.enums.EstadoEvento;
import com.svalero.eventia.domain.enums.TipoEvento;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "El nombre del evento es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @Column(length = 1500)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_evento", nullable = false)
    private TipoEvento tipoEvento;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Min(value = 0, message = "El precio base no puede ser negativo")
    @Column(name = "precio_base", nullable = false)
    private float precioBase;

    @Min(value = 1, message = "El aforo total debe ser mayor que 0")
    @Column(name = "aforo_total", nullable = false)
    private int aforoTotal;

    @Min(value = 0, message = "La edad mínima no puede ser negativa")
    @Column(name = "edad_minima", nullable = false)
    private int edadMinima;

    @Min(value = 0, message = "Las entradas disponibles no pueden ser negativas")
    @Column(name = "entradas_disponibles", nullable = false)
    private int entradasDisponibles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEvento estado;

    @Column(name = "imagen_url")
    private String imagenUrl;



    @ManyToOne
    @JoinColumn(name = "recinto_id")
    @NotNull(message = "El recinto es obligatorio")
    private Recinto recinto;

    @ManyToOne
    @JoinColumn(name = "organizador_id")
    @NotNull(message = "El organizador es obligatorio")
    private Usuario organizador;

    @ManyToMany
    @JoinTable(
            name = "eventos_artistas",
            joinColumns = @JoinColumn(name = "evento_id"),
            inverseJoinColumns = @JoinColumn(name = "artista_id")
    )
    private List<Artista> artistas;

    @OneToMany(mappedBy = "evento")
    @JsonIgnore
    private List<Reserva> reservas;

    @OneToMany(mappedBy = "evento")
    @JsonIgnore
    private List<Entrada> entradas;
    }
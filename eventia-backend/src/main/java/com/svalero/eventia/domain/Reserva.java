package com.svalero.eventia.domain;

import com.svalero.eventia.domain.enums.EstadoReserva;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "fecha_reserva")
    private LocalDateTime fechaReserva;

    @Min(value = 1, message = "La cantidad de entradas debe ser al menos 1")
    @Column(name = "cantidad_entradas")
    private int cantidadEntradas;

    @Min(value = 0, message = "El precio total no puede ser negativo")
    @Column(name = "precio_total")
    private float precioTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado;

    @Column(name = "codigo_reserva", unique = true)
    private String codigoReserva;



    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @NotNull(message = "El usuario es obligatorio")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "evento_id")
    @NotNull(message = "El evento es obligatorio")
    private Evento evento;

    @OneToMany(mappedBy = "reserva")
    private List<Entrada> entradas;
}
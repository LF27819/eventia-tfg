package com.svalero.eventia.domain;

import com.svalero.eventia.domain.enums.EstadoEntrada;
import com.svalero.eventia.domain.enums.TipoEntrada;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "entradas")
public class Entrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "codigo_qr", nullable = false, unique = true)
    private String codigoQr;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_entrada", nullable = false)
    private TipoEntrada tipoEntrada;

    @Min(value = 0, message = "El precio no puede ser negativo")
    @Column(nullable = false)
    private float precio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEntrada estado;

    @Column(name = "fecha_generacion", nullable = false)
    private LocalDateTime fechaGeneracion;

    @Column(name = "fecha_uso")
    private LocalDateTime fechaUso;



    @ManyToOne
    @JoinColumn(name = "reserva_id")
    @NotNull(message = "La reserva es obligatoria")
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "evento_id")
    @NotNull(message = "El evento es obligatorio")
    private Evento evento;
}
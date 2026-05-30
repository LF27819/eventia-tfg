package com.svalero.eventia.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "recintos")
public class Recinto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La dirección es obligatoria")
    @Column(nullable = false)
    private String direccion;

    @NotBlank(message = "La ciudad es obligatoria")
    @Column(nullable = false)
    private String ciudad;

    @Column
    private String provincia;

    @Min(value = 1, message = "El aforo debe ser mayor que 0")
    @Column(nullable = false)
    private int aforo;

    @Column(length = 1000)
    private String descripcion;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column
    private Double latitud;

    @Column
    private Double longitud;

    @Column(name = "google_place_id")
    private String googlePlaceId;



    @OneToMany(mappedBy = "recinto")
    private List<Evento> eventos;
}
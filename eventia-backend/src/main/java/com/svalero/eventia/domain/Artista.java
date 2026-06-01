package com.svalero.eventia.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "artistas")
public class Artista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "El nombre artístico es obligatorio")
    @Column(name = "nombre_artistico", nullable = false)
    private String nombreArtistico;

    @Column(name = "nombre_real")
    private String nombreReal;

    @Column(name = "genero_musical")
    private String generoMusical;

    @Column(length = 1000)
    private String descripcion;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column
    private String instagram;

    @Column
    private String spotify;

    @Column(nullable = false)
    private boolean activo;

    @Min(value = 0, message = "El caché no puede ser negativo")
    @Column
    private float cache;

    @Min(value = 0, message = "Los eventos realizados no pueden ser negativos")
    @Column(name = "eventos_realizados")
    private int eventosRealizados;


    @ManyToMany(mappedBy = "artistas")
    @JsonIgnore
    private List<Evento> eventos;
}
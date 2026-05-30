package com.svalero.eventia.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.svalero.eventia.domain.Artista;
import com.svalero.eventia.exception.ArtistaNotFoundException;
import com.svalero.eventia.repository.ArtistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

@Service
public class ArtistaService {

    @Autowired
    private ArtistaRepository artistaRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<Artista> findAll() {
        return artistaRepository.findAll();
    }

    public List<Artista> findAll(String nombreArtistico, String generoMusical, Boolean activo,
                                 Float cacheMinimo, Float cacheMaximo) {
        return artistaRepository.findByFilters(nombreArtistico, generoMusical, activo, cacheMinimo, cacheMaximo);
    }

    public Artista findById(Long id) throws ArtistaNotFoundException {
        return artistaRepository.findById(id)
                .orElseThrow(ArtistaNotFoundException::new);
    }

    public Artista add(Artista artista) {
        artista.setActivo(true);
        artista.setEventosRealizados(0);
        return artistaRepository.save(artista);
    }

    public Artista modify(Long id, Artista nuevoArtista) throws ArtistaNotFoundException {
        Artista artista = artistaRepository.findById(id)
                .orElseThrow(ArtistaNotFoundException::new);

        artista.setNombreArtistico(nuevoArtista.getNombreArtistico());
        artista.setNombreReal(nuevoArtista.getNombreReal());
        artista.setGeneroMusical(nuevoArtista.getGeneroMusical());
        artista.setDescripcion(nuevoArtista.getDescripcion());
        artista.setFechaNacimiento(nuevoArtista.getFechaNacimiento());
        artista.setImagenUrl(nuevoArtista.getImagenUrl());
        artista.setInstagram(nuevoArtista.getInstagram());
        artista.setSpotify(nuevoArtista.getSpotify());
        artista.setActivo(nuevoArtista.isActivo());
        artista.setCache(nuevoArtista.getCache());
        artista.setEventosRealizados(nuevoArtista.getEventosRealizados());

        return artistaRepository.save(artista);
    }

    public Artista patch(long id, Map<String, Object> updates) throws ArtistaNotFoundException {
        Artista artista = artistaRepository.findById(id)
                .orElseThrow(ArtistaNotFoundException::new);

        updates.forEach((key, value) -> {
            if (key.equals("id")) {
                return;
            }

            Field field = ReflectionUtils.findField(Artista.class, key);
            if (field != null) {
                field.setAccessible(true);
                Object convertedValue = objectMapper.convertValue(value, field.getType());
                ReflectionUtils.setField(field, artista, convertedValue);
            }
        });

        return artistaRepository.save(artista);
    }

    public Artista cambiarEstado(Long id, boolean activo) throws ArtistaNotFoundException {
        Artista artista = artistaRepository.findById(id)
                .orElseThrow(ArtistaNotFoundException::new);

        artista.setActivo(activo);
        return artistaRepository.save(artista);
    }

    public Artista incrementarEventosRealizados(Long id) throws ArtistaNotFoundException {
        Artista artista = artistaRepository.findById(id)
                .orElseThrow(ArtistaNotFoundException::new);

        artista.setEventosRealizados(artista.getEventosRealizados() + 1);
        return artistaRepository.save(artista);
    }

    public void delete(Long id) throws ArtistaNotFoundException {
        Artista artista = artistaRepository.findById(id)
                .orElseThrow(ArtistaNotFoundException::new);

        artistaRepository.delete(artista);
    }
}
package com.svalero.eventia.repository;

import com.svalero.eventia.domain.Artista;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtistaRepository extends CrudRepository<Artista, Long> {

    List<Artista> findAll();

    @Query("select a from Artista a where " +
            "(:nombreArtistico is null or lower(a.nombreArtistico) like lower(concat('%', :nombreArtistico, '%'))) and " +
            "(:generoMusical is null or lower(a.generoMusical) like lower(concat('%', :generoMusical, '%'))) and " +
            "(:activo is null or a.activo = :activo) and " +
            "(:cacheMinimo is null or a.cache >= :cacheMinimo) and " +
            "(:cacheMaximo is null or a.cache <= :cacheMaximo)")
    List<Artista> findByFilters(
            @Param("nombreArtistico") String nombreArtistico,
            @Param("generoMusical") String generoMusical,
            @Param("activo") Boolean activo,
            @Param("cacheMinimo") Float cacheMinimo,
            @Param("cacheMaximo") Float cacheMaximo
    );

    boolean existsByNombreArtistico(String nombreArtistico);
}
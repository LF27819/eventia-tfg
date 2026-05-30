package com.svalero.eventia.repository;

import com.svalero.eventia.domain.Recinto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RecintoRepository extends CrudRepository<Recinto, Long> {

    List<Recinto> findAll();

    @Query("select r from Recinto r where " +
            "(:nombre is null or lower(r.nombre) like lower(concat('%', :nombre, '%'))) and " +
            "(:ciudad is null or lower(r.ciudad) like lower(concat('%', :ciudad, '%'))) and " +
            "(:provincia is null or lower(r.provincia) like lower(concat('%', :provincia, '%'))) and " +
            "(:aforoMinimo is null or r.aforo >= :aforoMinimo)")
    List<Recinto> findByFilters(@Param("nombre") String nombre,
                                @Param("ciudad") String ciudad,
                                @Param("provincia") String provincia,
                                @Param("aforoMinimo") Integer aforoMinimo);

    Optional<Recinto> findByGooglePlaceId(String googlePlaceId);

    boolean existsByGooglePlaceId(String googlePlaceId);
}
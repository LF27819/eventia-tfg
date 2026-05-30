package com.svalero.eventia.repository;

import com.svalero.eventia.domain.Usuario;
import com.svalero.eventia.domain.enums.RolUsuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends CrudRepository<Usuario, Long> {

    List<Usuario> findAll();

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("select u from Usuario u where " +
            "(:nombre is null or lower(u.nombre) like lower(concat('%', :nombre, '%')) " +
            "or lower(u.apellidos) like lower(concat('%', :nombre, '%'))) and " +
            "(:email is null or lower(u.email) like lower(concat('%', :email, '%'))) and " +
            "(:rol is null or u.rol = :rol) and " +
            "(:activo is null or u.activo = :activo)")
    List<Usuario> findByFilters(@Param("nombre") String nombre,
                                @Param("email") String email,
                                @Param("rol") RolUsuario rol,
                                @Param("activo") Boolean activo);

    List<Usuario> findByFechaRegistroBetween(LocalDateTime desde, LocalDateTime hasta);
}
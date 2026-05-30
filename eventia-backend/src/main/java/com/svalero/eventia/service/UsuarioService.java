package com.svalero.eventia.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.svalero.eventia.domain.Usuario;
import com.svalero.eventia.domain.enums.RolUsuario;
import com.svalero.eventia.exception.UsuarioNotFoundException;
import com.svalero.eventia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> findAll(String nombre, String email, RolUsuario rol, Boolean activo) {
        return usuarioRepository.findByFilters(nombre, email, rol, activo);
    }

    public Usuario findById(long id) throws UsuarioNotFoundException {
        return usuarioRepository.findById(id)
                .orElseThrow(UsuarioNotFoundException::new);
    }

    public Usuario findByEmail(String email) throws UsuarioNotFoundException {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(UsuarioNotFoundException::new);
    }

    public List<Usuario> findByFechaRegistroBetween(LocalDateTime desde, LocalDateTime hasta) {
        return usuarioRepository.findByFechaRegistroBetween(desde, hasta);
    }

    public Usuario add(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setActivo(true);

        if (usuario.getRol() == null) {
            usuario.setRol(RolUsuario.USUARIO);
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario modify(long id, Usuario nuevoUsuario) throws UsuarioNotFoundException {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(UsuarioNotFoundException::new);

        usuario.setNombre(nuevoUsuario.getNombre());
        usuario.setApellidos(nuevoUsuario.getApellidos());
        usuario.setEmail(nuevoUsuario.getEmail());
        usuario.setPassword(nuevoUsuario.getPassword());
        usuario.setTelefono(nuevoUsuario.getTelefono());
        usuario.setFechaNacimiento(nuevoUsuario.getFechaNacimiento());
        usuario.setRol(nuevoUsuario.getRol());
        usuario.setActivo(nuevoUsuario.isActivo());

        return usuarioRepository.save(usuario);
    }

    public Usuario patch(long id, Map<String, Object> updates) throws UsuarioNotFoundException {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(UsuarioNotFoundException::new);

        updates.forEach((key, value) -> {
            if (key.equals("id")) {
                return;
            }

            Field field = ReflectionUtils.findField(Usuario.class, key);
            if (field != null) {
                field.setAccessible(true);
                Object convertedValue = objectMapper.convertValue(value, field.getType());
                ReflectionUtils.setField(field, usuario, convertedValue);
            }
        });

        return usuarioRepository.save(usuario);
    }

    public Usuario cambiarEstado(long id, boolean activo) throws UsuarioNotFoundException {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(UsuarioNotFoundException::new);

        usuario.setActivo(activo);
        return usuarioRepository.save(usuario);
    }

    public void delete(long id) throws UsuarioNotFoundException {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(UsuarioNotFoundException::new);

        usuarioRepository.delete(usuario);
    }
}
package com.svalero.eventia.controller;

import com.svalero.eventia.domain.Usuario;
import com.svalero.eventia.dto.auth.AuthResponse;
import com.svalero.eventia.dto.auth.LoginRequest;
import com.svalero.eventia.dto.auth.RegisterRequest;
import com.svalero.eventia.repository.UsuarioRepository;
import com.svalero.eventia.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.svalero.eventia.dto.auth.MeResponse;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {

        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtService.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getRol()
        );

        AuthResponse response = new AuthResponse(
                token,
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getNombre()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {

        if (usuarioRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(registerRequest.getNombre());
        usuario.setApellidos(registerRequest.getApellidos());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        usuario.setTelefono(registerRequest.getTelefono());

        usuario.setActivo(true);
        usuario.setFechaNacimiento(LocalDate.of(2000, 1, 1));
        usuario.setEventosAsistidos(0);
        usuario.setRol("CLIENTE");
        usuario.setSaldoCuenta(0f);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(
                usuarioGuardado.getId(),
                usuarioGuardado.getEmail(),
                usuarioGuardado.getRol()
        );

        AuthResponse response = new AuthResponse(
                token,
                usuarioGuardado.getEmail(),
                usuarioGuardado.getRol(),
                usuarioGuardado.getNombre()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MeResponse response = new MeResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getSaldoCuenta()
        );

        return ResponseEntity.ok(response);
    }
}
package com.svalero.eventia.config;

import com.svalero.eventia.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/eventos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/artistas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/recintos/**").permitAll()

                        .requestMatchers("/usuarios/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/eventos/**").hasAnyRole("ADMIN", "ORGANIZADOR")
                        .requestMatchers(HttpMethod.PUT, "/eventos/**").hasAnyRole("ADMIN", "ORGANIZADOR")
                        .requestMatchers(HttpMethod.PATCH, "/eventos/**").hasAnyRole("ADMIN", "ORGANIZADOR")
                        .requestMatchers(HttpMethod.DELETE, "/eventos/**").hasRole("ADMIN")

                        .requestMatchers("/reservas/**").authenticated()
                        .requestMatchers("/entradas/**").authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
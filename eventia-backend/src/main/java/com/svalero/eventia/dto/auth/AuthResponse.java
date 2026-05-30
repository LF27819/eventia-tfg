package com.svalero.eventia.dto.auth;

public class AuthResponse {

    private String token;
    private long id;
    private String email;
    private String rol;
    private String nombre;

    public AuthResponse() {
    }

    public AuthResponse(String token, long id, String email, String rol, String nombre) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.rol = rol;
        this.nombre = nombre;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
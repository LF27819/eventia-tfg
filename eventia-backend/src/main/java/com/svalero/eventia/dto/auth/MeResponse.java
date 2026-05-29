package com.svalero.eventia.dto.auth;

public class MeResponse {

    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private float saldoCuenta;

    public MeResponse() {
    }

    public MeResponse(Long id, String nombre, String email, String rol, float saldoCuenta) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.saldoCuenta = saldoCuenta;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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

    public float getSaldoCuenta() {
        return saldoCuenta;
    }

    public void setSaldoCuenta(float saldoCuenta) {
        this.saldoCuenta = saldoCuenta;
    }
}
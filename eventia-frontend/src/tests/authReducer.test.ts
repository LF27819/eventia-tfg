import { describe, expect, test } from "vitest";
import {
    authReducer,
    initialAuthState,
} from "../reducers/authReducer";

describe("authReducer", () => {
    test("debe guardar usuario y token al hacer login", () => {
        const result = authReducer(initialAuthState, {
            type: "LOGIN_SUCCESS",
            payload: {
                token: "token-test",
                user: {
                    id: 1,
                    nombre: "Lucia",
                    email: "lucia@gmail.com",
                    rol: "CLIENTE",
                    saldoCuenta: 50,
                },
            },
        });

        expect(result.token).toBe("token-test");
        expect(result.user?.nombre).toBe("Lucia");
        expect(result.user?.rol).toBe("CLIENTE");
        expect(result.loadingSession).toBe(false);
    });

    test("debe limpiar usuario y token al hacer logout", () => {
        const state = {
            token: "token-test",
            user: {
                id: 1,
                nombre: "Lucia",
                email: "lucia@gmail.com",
                rol: "CLIENTE",
                saldoCuenta: 50,
            },
            loadingSession: false,
        };

        const result = authReducer(state, { type: "LOGOUT" });

        expect(result.token).toBeNull();
        expect(result.user).toBeNull();
        expect(result.loadingSession).toBe(false);
    });

    test("debe actualizar datos parciales del usuario", () => {
        const state = {
            token: "token-test",
            user: {
                id: 1,
                nombre: "Lucia",
                email: "lucia@gmail.com",
                rol: "CLIENTE",
                saldoCuenta: 20,
            },
            loadingSession: false,
        };

        const result = authReducer(state, {
            type: "UPDATE_USER",
            payload: {
                saldoCuenta: 80,
            },
        });

        expect(result.user?.saldoCuenta).toBe(80);
        expect(result.user?.nombre).toBe("Lucia");
    });

    test("debe reducir el saldo del usuario correctamente tras una compra", () => {
        const state = {
            token: "token-test",
            user: {
                id: 1,
                nombre: "Lucia",
                email: "lucia@gmail.com",
                rol: "CLIENTE",
                saldoCuenta: 100,
            },
            loadingSession: false,
        };

        const result = authReducer(state, {
            type: "UPDATE_USER",
            payload: {
                saldoCuenta: 70,
            },
        });

        expect(result.user?.saldoCuenta).toBe(70);
    });

    test("debe restaurar sesión correctamente", () => {
        const result = authReducer(initialAuthState, {
            type: "RESTORE_SESSION_SUCCESS",
            payload: {
                token: "token-restore",
                user: {
                    id: 2,
                    nombre: "Carlos",
                    email: "carlos@gmail.com",
                    rol: "ORGANIZADOR",
                    saldoCuenta: 200,
                },
            },
        });

        expect(result.token).toBe("token-restore");
        expect(result.user?.rol).toBe("ORGANIZADOR");
        expect(result.loadingSession).toBe(false);
    });
});
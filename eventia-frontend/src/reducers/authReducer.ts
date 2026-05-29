import type { AuthUser } from "../types/auth";

export interface AuthState {
    token: string | null;
    user: AuthUser | null;
    loadingSession: boolean;
}

export type AuthAction =
    | { type: "RESTORE_SESSION_START" }
    | { type: "RESTORE_SESSION_SUCCESS"; payload: { token: string; user: AuthUser } }
    | { type: "RESTORE_SESSION_ERROR" }
    | { type: "LOGIN_SUCCESS"; payload: { token: string; user: AuthUser } }
    | { type: "REGISTER_SUCCESS"; payload: { token: string; user: AuthUser } }
    | { type: "UPDATE_USER"; payload: Partial<AuthUser> }
    | { type: "LOGOUT" };


export const initialAuthState: AuthState = {
    token: null,
    user: null,
    loadingSession: true,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "RESTORE_SESSION_START":
            return {
                ...state,
                loadingSession: true,
            };

        case "RESTORE_SESSION_SUCCESS":
            return {
                token: action.payload.token,
                user: action.payload.user,
                loadingSession: false,
            };

        case "RESTORE_SESSION_ERROR":
            return {
                token: null,
                user: null,
                loadingSession: false,
            };

        case "LOGIN_SUCCESS":
            return {
                token: action.payload.token,
                user: action.payload.user,
                loadingSession: false,
            };

        case "REGISTER_SUCCESS":
            return {
                token: action.payload.token,
                user: action.payload.user,
                loadingSession: false,
            };

        case "UPDATE_USER":
            return {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null,
            };

        case "LOGOUT":
            return {
                token: null,
                user: null,
                loadingSession: false,
            };

        default:
            return state;
    }
}
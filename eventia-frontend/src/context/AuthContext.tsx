import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  clearToken,
  getToken,
  loginRequest,
  meRequest,
  registerRequest,
  saveToken,
} from "../api/authService";
import type { AuthUser, LoginRequest, RegisterRequest } from "../types/auth";
import { authReducer, initialAuthState } from "../reducers/authReducer";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  loadingSession: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const restoreSession = async () => {
      dispatch({ type: "RESTORE_SESSION_START" });

      const storedToken = getToken();

      if (!storedToken) {
        dispatch({ type: "RESTORE_SESSION_ERROR" });
        return;
      }

      try {
        const me = await meRequest(storedToken);

        dispatch({
          type: "RESTORE_SESSION_SUCCESS",
          payload: {
            token: storedToken,
            user: {
              id: me.id,
              email: me.email,
              rol: me.rol,
              nombre: me.nombre,
              saldoCuenta: me.saldoCuenta,
            },
          },
        });
      } catch (error) {
        console.error("No se pudo restaurar la sesión:", error);
        clearToken();
        dispatch({ type: "RESTORE_SESSION_ERROR" });
      }
    };

    restoreSession();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await loginRequest(data);

    saveToken(response.token);

    const me = await meRequest(response.token);

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        token: response.token,
        user: {
          id: me.id,
          email: me.email,
          rol: me.rol,
          nombre: me.nombre,
          saldoCuenta: me.saldoCuenta,
        },
      },
    });
  };

  const register = async (data: RegisterRequest) => {
    const response = await registerRequest(data);

    saveToken(response.token);

    const me = await meRequest(response.token);

    dispatch({
      type: "REGISTER_SUCCESS",
      payload: {
        token: response.token,
        user: {
          id: me.id,
          email: me.email,
          rol: me.rol,
          nombre: me.nombre,
          saldoCuenta: me.saldoCuenta,
        },
      },
    });
  };

  const logout = () => {
    clearToken();
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (data: Partial<AuthUser>) => {
    dispatch({ type: "UPDATE_USER", payload: data });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        user: state.user,
        loadingSession: state.loadingSession,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
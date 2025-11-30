/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "./page";

// Mock fetch
global.fetch = jest.fn();

// Mock router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
  pushMock.mockClear();
});

// Helpers de inputs usando selectores por type (porque los <label> no están asociados)
const getEmailInput = (): HTMLInputElement =>
  document.querySelector('input[type="email"]') as HTMLInputElement;
const getPasswordInput = (): HTMLInputElement =>
  document.querySelector('input[type="password"]') as HTMLInputElement;

// Render inicial → modo login
test("muestra el formulario en modo login inicialmente", () => {
  render(<LoginPage />);

  expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
});

// Cambiar a modo register
test("cambia al modo registro al hacer clic en el link", () => {
  render(<LoginPage />);

  fireEvent.click(screen.getByText("¿No tienes cuenta? Regístrate"));

  expect(screen.getByText("Crear cuenta")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Registrarme" })).toBeInTheDocument();
});

// Error en login/register → muestra mensaje del servidor
test("muestra mensaje de error al fallar la petición", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: async () => ({ message: "Credenciales inválidas" }),
  });

  render(<LoginPage />);

  // obtener inputs por type
  const email = getEmailInput();
  const pass = getPasswordInput();

  expect(email).toBeTruthy();
  expect(pass).toBeTruthy();

  fireEvent.change(email, {
    target: { value: "test@mail.com" },
  });
  fireEvent.change(pass, {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

  expect(await screen.findByText("Credenciales inválidas")).toBeInTheDocument();
});

// Registro exitoso → mensaje + cambia modo a login
test("en registro exitoso muestra mensaje y cambia a modo login", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });

  render(<LoginPage />);

  fireEvent.click(screen.getByText("¿No tienes cuenta? Regístrate"));

  const email = getEmailInput();
  const pass = getPasswordInput();

  expect(email).toBeTruthy();
  expect(pass).toBeTruthy();

  fireEvent.change(email, {
    target: { value: "nuevo@mail.com" },
  });
  fireEvent.change(pass, {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Registrarme" }));

  expect(
    await screen.findByText("Usuario creado, ahora inicia sesión.")
  ).toBeInTheDocument();

  // El título vuelve a "Iniciar sesión"
  expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
});

// Login exitoso → dispara loginSuccess y redirige a /movie
test("en login exitoso dispara loginSuccess y redirige a /movie", async () => {
  const dispatchSpy = jest.spyOn(window, "dispatchEvent");

  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  });

  render(<LoginPage />);

  const email = getEmailInput();
  const pass = getPasswordInput();

  expect(email).toBeTruthy();
  expect(pass).toBeTruthy();

  fireEvent.change(email, {
    target: { value: "user@mail.com" },
  });
  fireEvent.change(pass, {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

  // Esperamos de forma asíncrona que el evento se haya disparado
  await waitFor(() => {
    expect(dispatchSpy).toHaveBeenCalled();
  });

  // Comprobación más robusta del evento: verificar tipo
  const firstCallArg = dispatchSpy.mock.calls[0][0];
  expect(firstCallArg).toBeInstanceOf(Event);
  expect((firstCallArg as Event).type).toBe("loginSuccess");

  // Verificamos la redirección
  expect(pushMock).toHaveBeenCalledWith("/movie");

  // limpiamos el spy
  dispatchSpy.mockRestore();
});

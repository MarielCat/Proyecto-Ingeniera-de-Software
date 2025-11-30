/** @jest-environment jsdom */
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";

// ---- MOCKS ----

// Mock router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/",
}));

// Mock addSearch
const addSearchMock = jest.fn();
jest.mock("@/lib/reco", () => ({
  addSearch: (...args: any[]) => addSearchMock(...args),
}));

// Mock global.fetch
global.fetch = jest.fn();

// Helper: mock scrollY manualmente
const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    writable: true,
    configurable: true,
    value,
  });
};

// Reset mocks
beforeEach(() => {
  pushMock.mockClear();
  addSearchMock.mockClear();
  (fetch as jest.Mock).mockClear();
});

// ---- TESTS ----

describe("Header Component", () => {

  test("muestra el logo y el botón de login si no hay usuario", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await act(async () => {
      render(<Header onMenuClick={() => {}} />);
    });

    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  test("realiza búsqueda con Enter y llama addSearch + router.push", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await act(async () => {
      render(<Header onMenuClick={() => {}} />);
    });

    const input = screen.getAllByPlaceholderText(/buscar/i)[0];

    fireEvent.change(input, { target: { value: "react" } });

    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(addSearchMock).toHaveBeenCalledTimes(1);
    expect(addSearchMock.mock.calls[0][0].query).toBe("react");

    expect(pushMock).toHaveBeenCalledWith("/search?query=react");
  });

  test("oculta el header al hacer scroll hacia abajo", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await act(async () => {
      render(<Header onMenuClick={() => {}} />);
    });

    const header = screen.getByRole("banner");

    // scroll hacia abajo
    setScrollY(300);
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(header.className).toContain("-translate-y-full");
  });

  test("muestra el header al hacer scroll hacia arriba", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    await act(async () => {
      render(<Header onMenuClick={() => {}} />);
    });

    const header = screen.getByRole("banner");

    // ↓ scrollY grande
    setScrollY(300);
    await act(async () => window.dispatchEvent(new Event("scroll")));

    // ↑ scrollY menor
    setScrollY(50);
    await act(async () => window.dispatchEvent(new Event("scroll")));

    expect(header.className).toContain("translate-y-0");
  });

  test("muestra nombre del usuario cuando fetch devuelve ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ email: "test@example.com" }),
    });

    await act(async () => {
      render(<Header onMenuClick={() => {}} />);
    });

    expect(screen.getByText("Hola, test@example.com")).toBeInTheDocument();
  });

});


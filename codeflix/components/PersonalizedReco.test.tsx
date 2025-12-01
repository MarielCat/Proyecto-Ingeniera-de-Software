/**
 * @file components/PersonalizedReco.test.tsx
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import PersonalizedReco from "@/components/PersonalizedReco";

// --- MOCKS --- //
jest.mock("@/components/Carousel", () => {
  return function MockCarousel(props: any) {
    return (
      <div data-testid="carousel">
        MockCarousel - items: {props.items.length}
      </div>
    );
  };
});

jest.mock("@/lib/reco", () => ({
  getClicks: jest.fn(),
  getSearches: jest.fn(),
}));

const mockGetClicks = require("@/lib/reco").getClicks;
const mockGetSearches = require("@/lib/reco").getSearches;

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("PersonalizedReco", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra mensaje de carga inicialmente", () => {
    mockGetClicks.mockReturnValue([]);
    mockGetSearches.mockReturnValue([]);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    render(<PersonalizedReco />);

    expect(
      screen.getByText("Cargando recomendaciones…")
    ).toBeInTheDocument();
  });

  test("muestra recomendaciones y el carousel cuando API devuelve items", async () => {
    mockGetClicks.mockReturnValue([{ movieId: 1 }]);
    mockGetSearches.mockReturnValue([{ query: "test" }]);

    const mockItems = [
      { id: 10, title: "Movie A" },
      { id: 20, title: "Movie B" },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockItems }),
    });

    render(<PersonalizedReco />);

    // Espera a que deje de cargar
    await waitFor(() =>
      expect(
        screen.queryByText("Cargando recomendaciones…")
      ).not.toBeInTheDocument()
    );

    expect(
      screen.getByText("Encontradas 2 recomendaciones.")
    ).toBeInTheDocument();

    expect(screen.getByTestId("carousel")).toBeInTheDocument();
  });

  test("muestra mensaje de 'Sin recomendaciones' cuando API devuelve array vacío", async () => {
    mockGetClicks.mockReturnValue([{ movieId: 1 }]);
    mockGetSearches.mockReturnValue([{ query: "hola" }]);

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    render(<PersonalizedReco />);

    await waitFor(() =>
      expect(
        screen.queryByText("Cargando recomendaciones…")
      ).not.toBeInTheDocument()
    );

    expect(
      screen.getByText("Sin recomendaciones por ahora.")
    ).toBeInTheDocument();

    expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
  });

  test("muestra error cuando la API rechaza la petición", async () => {
    mockGetClicks.mockReturnValue([{ movieId: 99 }]);
    mockGetSearches.mockReturnValue([{ query: "x" }]);

    mockFetch.mockRejectedValue(new Error("Network fail"));

    render(<PersonalizedReco />);

    await waitFor(() =>
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    );

    expect(screen.getByText("Error: Network fail")).toBeInTheDocument();
  });

  test("cuando la API responde con status !ok muestra 'Sin recomendaciones por ahora.'", async () => {
    mockGetClicks.mockReturnValue([{ movieId: 21 }]);
    mockGetSearches.mockReturnValue([{ query: "y" }]);

    mockFetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    render(<PersonalizedReco />);

    // Esperamos que termine la carga y que muestre el fallback "Sin recomendaciones por ahora."
    await waitFor(() =>
      expect(
        screen.queryByText("Cargando recomendaciones…")
      ).not.toBeInTheDocument()
    );

    expect(
      screen.getByText("Sin recomendaciones por ahora.")
    ).toBeInTheDocument();

    // Aseguramos que no se renderiza el carousel
    expect(screen.queryByTestId("carousel")).not.toBeInTheDocument();
  });

});


/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchPage from "./page";

// Mock global fetch
global.fetch = jest.fn();

// Mock del componente MovieCard
jest.mock("@/components/MovieCard", () => {
  return function MockMovieCard({ movie }: any) {
    return (
      <div data-testid="movie-card">
        MOCK-CARD: {movie.title || movie.name}
      </div>
    );
  };
});

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
  process.env.TMDB_KEY = "TEST_KEY";
});

// Cuando NO hay query
test("muestra mensaje inicial cuando no se envía query", async () => {
  const searchParams = Promise.resolve({});

  const ui = await SearchPage({ searchParams });
  render(ui);

  expect(
    await screen.findByText("Realiza una búsqueda")
  ).toBeInTheDocument();
});

// Cuando query vacío o espacios
test("muestra mensaje cuando query está vacío", async () => {
  const searchParams = Promise.resolve({ query: "   " });

  const ui = await SearchPage({ searchParams });
  render(ui);

  expect(
    await screen.findByText("Realiza una búsqueda")
  ).toBeInTheDocument();
});

// Query válida pero resultados vacíos
test("muestra mensaje de sin resultados si API devuelve lista vacía", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ results: [] }),
  });

  const searchParams = Promise.resolve({ query: "harry" });

  const ui = await SearchPage({ searchParams });
  render(ui);

  expect(
    await screen.findByText(/Sin resultados en la categoría de fantasía/i)
  ).toBeInTheDocument();
});

// Renderiza MovieCard por cada resultado
test("renderiza MovieCard por cada resultado", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      results: [
        { id: 1, title: "Movie A" },
        { id: 2, title: "Movie B" },
      ],
    }),
  });

  const searchParams = Promise.resolve({ query: "ring" });

  const ui = await SearchPage({ searchParams });
  render(ui);

  const cards = await screen.findAllByTestId("movie-card");
  expect(cards.length).toBe(2);
  expect(cards[0]).toHaveTextContent("Movie A");
  expect(cards[1]).toHaveTextContent("Movie B");
});

// Título incluye el query
test("muestra el encabezado con el término buscado", async () => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ results: [] }),
  });

  const searchParams = Promise.resolve({ query: "narnia" });

  const ui = await SearchPage({ searchParams });
  render(ui);

  expect(await screen.findByText(/Resultados para:/i)).toBeInTheDocument();
  expect(await screen.findByText(/«narnia»/i)).toBeInTheDocument();
});


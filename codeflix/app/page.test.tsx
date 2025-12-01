/** @jest-environment jsdom */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Importar el componente a testear
import Home from "./page";

// ---- MOCKS ----

// Mock de funciones TMDB
jest.mock("@/lib/tmdb", () => ({
  getFantasyPopular: jest.fn(() => Promise.resolve([{ id: 1, title: "Pop1" }])),
  getFantasyTopRated: jest.fn(() => Promise.resolve([{ id: 2, title: "Top1" }])),
  getFantasyLatest: jest.fn(() => Promise.resolve([{ id: 3, title: "Latest1" }])),
  getFantasyUpcoming: jest.fn(() => Promise.resolve([{ id: 4, title: "Soon1" }])),
  getFantasyTrending: jest.fn(() => Promise.resolve([{ id: 5, title: "Trend1" }])),
  getGenres: jest.fn(() =>
    Promise.resolve([
      { id: 100, name: "Magia" },
      { id: 101, name: "Aventura" },
    ])
  ),
  getRecommendedFantasyByMovieId: jest.fn(() =>
    Promise.resolve([{ id: 6, title: "Reco1" }])
  ),
}));

// Mock de addClick
jest.mock("@/lib/reco", () => ({
  addClick: jest.fn(),
}));

// Mock componentes
jest.mock("@/components/Carousel", () => (props: any) => (
  <div data-testid={`carousel-${props.title}`}>{props.title}</div>
));

jest.mock("@/components/PersonalizedReco", () => () => (
  <div data-testid="personalized-reco">PersonalizedReco</div>
));

// Mock de next/font/google
jest.mock("next/font/google", () => ({
  Lora: () => ({ className: "lora-font" }),
}));

// ---- TESTS ----

describe("Home Page (Server Component)", () => {
  test("Renderiza los carruseles y géneros correctamente", async () => {
    // Render del server component de forma correcta
    render(await Home());

    // Sección personalizada
    expect(screen.getByTestId("personalized-reco")).toBeInTheDocument();

    // Carruseles mockeados
    const titles = [
      "Más populares",
      "Más recientes",
      "Mejor calificadas",
      "Próximos estrenos",
      "Recomendadas",
    ];

    titles.forEach((t) => {
      expect(screen.getByTestId(`carousel-${t}`)).toBeInTheDocument();
    });

    // Géneros mockeados
    expect(screen.getByText("Magia")).toBeInTheDocument();
    expect(screen.getByText("Aventura")).toBeInTheDocument();
  });

  test("Llama correctamente a todas las funciones TMDB", async () => {
    const tmdb = require("@/lib/tmdb");

    render(await Home());

    expect(tmdb.getFantasyPopular).toHaveBeenCalled();
    expect(tmdb.getFantasyTopRated).toHaveBeenCalledWith(200);
    expect(tmdb.getFantasyLatest).toHaveBeenCalled();
    expect(tmdb.getFantasyUpcoming).toHaveBeenCalled();
    expect(tmdb.getFantasyTrending).toHaveBeenCalled();
    expect(tmdb.getGenres).toHaveBeenCalled();
    expect(tmdb.getRecommendedFantasyByMovieId).toHaveBeenCalledWith(120);
  });

  test("Renderiza el background con la imagen local", async () => {
    render(await Home());

    // Selector más estable
    const bg = document.querySelector("div.fixed.inset-0");

    expect(bg).toBeInTheDocument();

    // Verificar estilo real aplicado
    const bgStyle = bg?.getAttribute("style") ?? "";

    expect(bgStyle).toContain("purple-magic-sparkling-shining-stars.png");
  });
});


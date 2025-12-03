/**
 * @file __tests__/recommendations.test.ts
 * Pruebas unitarias del módulo de recomendaciones.
 */

import { GET } from "@/app/api/recommendations/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => require("../__mocks__/prisma"));
jest.mock("node-fetch");
global.fetch = jest.fn();

describe("Unit: Recommendations functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Devuelve 401 si no hay token", async () => {
    const req = new NextRequest("http://localhost/api/recommendations");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("No autenticado");
  });

  test("Devuelve recomendaciones basadas en clics", async () => {
    const req = new NextRequest("http://localhost/api/recommendations", {
      headers: {
        cookie: "codeflix_token=VALID_FAKE_TOKEN"
      }
    });

    // Mock token decode
    jest.spyOn(require("jsonwebtoken"), "verify").mockReturnValue({ userId: 1 });

    // Mock Prisma
    const prisma = require("../__mocks__/prisma");
    prisma.userClick.findMany.mockResolvedValue([
      { movieId: 10 },
      { movieId: 20 }
    ]);
    prisma.userSearch.findMany.mockResolvedValue([]);

    // Mock TMDB responses
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          results: [
            { id: 999, genre_ids: [14], popularity: 100, vote_average: 7.5 },
          ]
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          results: [
            { id: 1000, genre_ids: [14], popularity: 200, vote_average: 8.2 },
          ]
        })
      });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.items.length).toBeGreaterThan(0);
    expect(json.items[0].id).toBe(1000); // highest score
  });

  test("Si no hay clics ni búsquedas devuelve trending", async () => {
    const req = new NextRequest("http://localhost/api/recommendations", {
      headers: {
        cookie: "codeflix_token=SOME"
      }
    });

    jest.spyOn(require("jsonwebtoken"), "verify").mockReturnValue({ userId: 1 });

    const prisma = require("../__mocks__/prisma");
    prisma.userClick.findMany.mockResolvedValue([]);
    prisma.userSearch.findMany.mockResolvedValue([]);

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        results: [
          { id: 88, genre_ids: [14], popularity: 20, vote_average: 6 },
          { id: 99, genre_ids: [14], popularity: 30, vote_average: 9 },
        ]
      })
    });

    const res = await GET(req);
    const json = await res.json();

    expect(json.items[0].id).toBe(99);
  });
});
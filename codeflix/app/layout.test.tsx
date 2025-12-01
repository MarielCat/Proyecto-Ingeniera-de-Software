import { render, screen, fireEvent } from "@testing-library/react";
import RootLayout from "./layout";
import "@testing-library/jest-dom";

// Mock de next/font/google 
jest.mock("next/font/google", () => ({
  Cinzel: () => ({ className: "cinzel-font" }),
  Lora: () => ({ className: "lora-font" }),
}));

// Mock del Header con un botón que llama `onMenuClick`
jest.mock("@/components/Header", () => (props: any) => (
  <button data-testid="header-button" onClick={props.onMenuClick}>
    Abrir menú
  </button>
));

// Mock del SideMenu con un botón que llama `onClose`
jest.mock("@/components/SideMenu", () => (props: any) => (
  <div data-testid="side-menu">
    <span>{props.open ? "open" : "closed"}</span>
    <button onClick={props.onClose}>Close</button>
  </div>
));

// ------------------------- TESTS -------------------------

describe("RootLayout", () => {
  // Estado inicial
  test("menuOpen inicia en false", () => {
    render(
      <RootLayout>
        <div>contenido</div>
      </RootLayout>
    );

    const sideMenu = screen.getByTestId("side-menu");
    expect(sideMenu).toHaveTextContent("closed");
  });

  // Click en Header abre el menú
  test("Click en Header -> SideMenu se abre", () => {
    render(
      <RootLayout>
        <div>contenido</div>
      </RootLayout>
    );

    const btn = screen.getByTestId("header-button");
    fireEvent.click(btn);

    const sideMenu = screen.getByTestId("side-menu");
    expect(sideMenu).toHaveTextContent("open");
  });

  // Ejecutar onClose cierra el menú
  test("SideMenu onClose -> se cierra", () => {
    render(
      <RootLayout>
        <div>contenido</div>
      </RootLayout>
    );

    const headerBtn = screen.getByTestId("header-button");
    fireEvent.click(headerBtn);

    const sideMenuCloseBtn = screen.getByText("Close");
    fireEvent.click(sideMenuCloseBtn);

    const sideMenu = screen.getByTestId("side-menu");
    expect(sideMenu).toHaveTextContent("closed");
  });

  // Verifica la opacidad según menuOpen
  test("Cambia la opacidad según menuOpen", () => {
    render(
      <RootLayout>
        <div>contenido</div>
      </RootLayout>
    );

    // Encuentra el nodo que contiene "contenido" y sube al ancestro que tiene 'transition-all'
    const findContentWrapper = () =>
      screen.getByText("contenido").closest('div[class*="transition-all"]');

    const wrapperBefore = findContentWrapper();
    expect(wrapperBefore).toBeTruthy();
    expect(wrapperBefore).toHaveClass("opacity-100");

    // Abrir menú
    fireEvent.click(screen.getByTestId("header-button"));

    // Re-evaluar el wrapper (puede ser el mismo nodo, pero buscamos de nuevo para estar seguros)
    const wrapperAfter = findContentWrapper();
    expect(wrapperAfter).toBeTruthy();
    expect(wrapperAfter).toHaveClass("opacity-40");
  });

  // Hero section se renderiza correctamente
  test("Renderiza el Hero section correctamente", () => {
    render(
      <RootLayout>
        <div>contenido</div>
      </RootLayout>
    );

    expect(screen.getByText("CodeFlix")).toBeInTheDocument();
    expect(screen.getByText("Tu guía de fantasía")).toBeInTheDocument();
    expect(screen.getByText(/Busca, filtra y descubre/)).toBeInTheDocument();

    const video = document.querySelector("video");
    expect(video).toHaveAttribute("src", "/bg.mp4");
  });
});







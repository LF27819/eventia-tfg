import { describe, expect, test } from "vitest";
import { esAdmin, esCliente, esOrganizador } from "../utils/roles";

describe("roles utils", () => {
  test("detecta rol ADMIN correctamente", () => {
    expect(esAdmin("ADMIN")).toBe(true);
    expect(esAdmin("CLIENTE")).toBe(false);
  });

  test("detecta rol ORGANIZADOR correctamente", () => {
    expect(esOrganizador("ORGANIZADOR")).toBe(true);
    expect(esOrganizador("ADMIN")).toBe(false);
  });

  test("detecta rol CLIENTE correctamente", () => {
    expect(esCliente("CLIENTE")).toBe(true);
    expect(esCliente("ORGANIZADOR")).toBe(false);
  });
});
import { test, expect } from '@playwright/test';

let url = "http://localhost:8080";

async function login(page) {
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Correo electronico *").fill("test@example.com");
  await page.getByLabel("Contraseña *").click();
  await page.getByLabel("Contraseña *").fill("test1234");
  await page.getByLabel("Contraseña *").press("Enter");
}

test("testHistorias", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();
  await page.getByRole("heading", { name: "Historias import" }).click();

  await expect(page.locator("html")).toContainText("Historias");
  await expect(
    page.getByRole("heading", { name: "Historias import" })
  ).toContainText("Historias");
  await expect(
    page.getByRole("link", { name: "Mis historias" })
  ).toContainText("Mis historias");

  await expect(page.getByRole("button", { name: "Historia" })).toContainText(
    "historia"
  );
});

async function createClone(page) {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole("button", { name: "historia" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "historia"
  );

  await page.getByLabel('Nombre de la historia *').fill("Las aventuras de Sherlock Holmes");

  await page.getByRole('combobox', { name: 'Generos' }).fill("Misterio");

  await page.getByRole('combobox', { name: 'Generos' }).press("Enter");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");

  await page.getByRole('button', { name: 'Crear historia' }).click();

}

test("testCrearHistorias", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole("button", { name: "historia" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "historia"
  );

  await page.getByLabel('Nombre de la historia *').fill("Las aventuras de Sherlock Holmes");

  await page.getByRole('combobox', { name: 'Generos' }).fill("Misterio");

  await page.getByRole('combobox', { name: 'Generos' }).press("Enter");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");

  await page.getByRole('button', { name: 'Crear historia' }).click();

  await expect((page.getByRole('button', { name: 'Sherlock' }).last())).toContainText("aventuras");

});


test("testCrearHistoriasClone", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole("button", { name: "historia" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "historia"
  );

  await page.getByLabel('Nombre de la historia *').fill("Las aventuras de Sherlock Holmes");

  await page.getByRole('combobox', { name: 'Generos' }).fill("Misterio");

  await page.getByRole('combobox', { name: 'Generos' }).press("Enter");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");

  await page.getByRole('button', { name: 'Crear historia' }).click();

  await expect((page.getByRole('button', { name: 'Sherlock' }).last())).toContainText("aventuras");

});


test("testCrearHistoriasSinNombre", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole("button", { name: "historia" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "historia"
  );

  await page.getByLabel('Nombre de la historia *').fill("");

  await page.getByRole('combobox', { name: 'Generos' }).fill("Misterio");

  await page.getByRole('combobox', { name: 'Generos' }).press("Enter");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");

  await page.getByRole('button', { name: 'Crear historia' }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "historia"
  );

});


test("testVisualizarHistoria", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await expect(page.getByText('Nombre de la historiaLas aventuras de Sherlock Holmes')).toBeVisible();

  await expect(page.getByText('Generos narrativosMisterio')).toBeVisible();

  await expect(page.getByText('DescripciónSherlock se embarca en una aventura sin precedentes, a la cual deberá')).toBeVisible();


});

test("testEliminarHistoria", async ({ page }) => {
  await login(page);

  await createClone(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.  getByRole('button', { name: 'delete' }).last().click();

  await expect(page.getByRole('heading', { name: '¿Eliminar historia?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar la historia? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Eliminar' }).click();

  await expect(page.getByLabel('Buscar')).toBeVisible();

});

test("testEliminarHistoriaCancel", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.  getByRole('button', { name: 'delete' }).last().click();

  await expect(page.getByRole('heading', { name: '¿Eliminar historia?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar la historia? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar' }).click();

  await expect(page.getByRole('heading', { name: '¿Eliminar historia?' })).toBeHidden();

  await expect(page.getByRole('button', { name: 'Relaciones de personajes' })).toBeVisible();

});

test("testExportar", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'export' }).last().click();

  await expect(page.getByRole('alert')).toContainText("¡Archivo exportado con exito!");

});

test("testActualizarHistoria", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'edit' }).last().click();

  expect((await page.getByLabel('Nombre de la historia *').inputValue()).toString()).toContain("Las aventuras de Sherlock Holmes");

  expect((await page.getByRole('button', { name: 'Misterio' })).toString()).toContain("Misterio");

  expect((await page.getByLabel('Descripción').inputValue()).toString()).toContain("Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");


  await page.getByLabel('Nombre de la historia *').fill("Las desaventuras de Watson");

  await page.getByRole('combobox', { name: 'Generos' }).fill("Ciencia Ficción");

  await page.getByRole('combobox', { name: 'Generos' }).press("Enter");

  await page.getByLabel('Descripción').fill("Watson se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");

  await page.getByRole('button', { name: 'Actualizar historia' }).click();

  await expect((page.getByRole('button', { name: 'Watson' }).last())).toContainText("desaventuras");

  await page.getByRole('button', { name: 'Watson' }).last().click();

  await expect(page.getByText('Nombre de la historiaLas desaventuras de Watson')).toBeVisible();

  await expect(page.getByText('Generos narrativosMisterio, Ciencia Ficción')).toBeVisible();

  await expect(page.getByText('DescripciónWatson se embarca en una aventura sin precedentes, a la cual deberá e')).toBeVisible();



});

test("testActualizarHistoriaSinNombre", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'edit' }).last().click();

  expect((await page.getByLabel('Nombre de la historia *').inputValue()).toString()).toContain("Las aventuras de Sherlock Holmes");

  expect((await page.getByRole('button', { name: 'Misterio' })).toString()).toContain("Misterio");

  expect((await page.getByLabel('Descripción').inputValue()).toString()).toContain("Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");


  await page.getByLabel('Nombre de la historia *').fill("");

  await page.getByRole('combobox', { name: 'Generos' }).fill("Ciencia Ficción");

  await page.getByRole('combobox', { name: 'Generos' }).press("Enter");

  await page.getByLabel('Descripción').fill("Watson se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");

  await page.getByRole('button', { name: 'Actualizar historia' }).click();

  await expect(page.getByRole("heading", { name: "Actualizar" })).toContainText(
    "historia"
  );

});



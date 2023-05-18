import { test, expect } from '@playwright/test';

let url = "http://localhost:8080";


async function login(page) {
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Correo electronico *").fill("test@example.com");
  await page.getByLabel("Contraseña *").click();
  await page.getByLabel("Contraseña *").fill("test1234");
  await page.getByLabel("Contraseña *").press("Enter");
}


async function createStory(page) {
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

async function createArc(page) {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Añadir Trama' }).last().click();

  await page.getByLabel('Nombre de la trama *').fill("Un nuevo comienzo");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado");

  await page.getByRole('button', { name: 'Crear trama' }).click();


}



test("testCrearTramas", async ({ page }) => {
  await login(page);

  await createStory(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Añadir Trama' }).last().click();

  await page.getByLabel('Nombre de la trama *').fill("Un nuevo comienzo");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado");

  await page.getByRole('button', { name: 'Crear trama' }).click();

  await expect(page.getByRole('button', { name: 'Añadir Trama' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Un nuevo comienzo' })).toBeVisible()


});

test("testCrearTramaSinNombre", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Añadir Trama' }).last().click();

  await page.getByLabel('Nombre de la trama *').fill("");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado");

  await page.getByRole('button', { name: 'Crear trama' }).click();

  await expect(page.getByRole('button', { name: 'Crear trama' })).toBeVisible();

});

test("testVisualizarTramas", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo' }).last().click();

  await expect(page.getByText('Nombre de la tramaUn nuevo comienzo')).toBeVisible();

  await expect(page.getByText('FechaSin fecha')).toBeVisible();

  await expect(page.getByText('DescripciónSherlock se embarca en una nueva aventura, una para la que puede que ')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Añadir Escena' })).toBeVisible();

});

test("testEliminarTrama", async ({ page }) => {
  await login(page);

  await createArc(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo' }).last().click();

  await page.getByRole('button', { name: 'delete' }).last().click();

  await expect(page.getByRole('heading', { name: '¿Eliminar trama?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar la trama? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Eliminar' }).click();

  await expect(page.getByRole('button', { name: 'Añadir Trama' })).toBeVisible();

});


test("testEliminarTramaCancel", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo' }).last().click();

  await page.getByRole('button', { name: 'delete' }).last().click();

  await expect(page.getByRole('heading', { name: '¿Eliminar trama?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar la trama? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar' }).click();

  await expect(page.getByRole('button', { name: 'Añadir Escena' })).toBeVisible();

  await expect(page.getByText('¿Seguro de que desea eliminar la trama? Esta acción no se puede deshacer.')).toBeHidden();

});

test("testActualizarTrama", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo' }).last().click();

  await page.getByRole('button', { name: 'edit' }).last().click();

  expect((await page.getByLabel('Nombre de la trama *').inputValue()).toString()).toContain("Un nuevo comienzo");

  expect((await page.getByLabel('Descripción').inputValue()).toString()).toContain("Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado");

  await page.getByLabel('Nombre de la trama *').fill("Un final apropiado");

  await page.getByLabel('Descripción').fill("Watson enucentra la pista definitiva, pero el caos se acerca.");

  await page.getByRole('button', { name: 'Actualizar trama' }).click();

  await expect(page.getByRole('button', { name: 'Un final apropiado' })).toBeVisible();

  await page.getByRole('button', { name: 'Un final apropiado' }).click();

  await expect(page.getByText('Nombre de la tramaUn final apropiado')).toBeVisible();

  await expect(page.getByText('FechaSin fecha')).toBeVisible();

  await expect(page.getByText('DescripciónWatson enucentra la pista definitiva, pero el caos se acerca.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Añadir Escena' })).toBeVisible();

});


test("testActualizarTramaSinNombre", async ({ page }) => {
  await login(page);

  await createArc(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo' }).last().click();

  await page.getByRole('button', { name: 'edit' }).last().click();

  expect((await page.getByLabel('Nombre de la trama *').inputValue()).toString()).toContain("");

  expect((await page.getByLabel('Descripción').inputValue()).toString()).toContain("Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado");

  await page.getByRole('button', { name: 'Actualizar trama' }).click();

  await expect(page.getByRole('button', { name: 'Actualizar trama' })).toBeVisible();


});


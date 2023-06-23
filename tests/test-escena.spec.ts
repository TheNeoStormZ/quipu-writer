import { test, expect } from '@playwright/test';

let url = "http://localhost:8080";


async function login(page) {
  await page.goto(url + "/login");
  await page.getByLabel("Correo electrónico *").fill("test@example.com");
  await page.getByLabel("Contraseña *").click();
  await page.getByLabel("Contraseña *").fill("test1234");
  await page.getByLabel("Contraseña *").press("Enter");
}


async function createFullStory(page) {

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole("button", { name: "historia" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "historia"
  );

  await page.getByLabel('Nombre de la historia *').fill("Las aventuras de Sherlock Holmes");

  await page.getByRole('combobox', { name: 'Géneros' }).fill("Misterio");

  await page.getByRole('combobox', { name: 'Géneros' }).press("Enter");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.");

  await page.getByRole('button', { name: 'Crear historia' }).click();

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Añadir Trama' }).last().click();

  await page.getByLabel('Nombre de la trama *').fill("Un nuevo comienzo");

  await page.getByLabel('Descripción').fill("Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado");

  await page.getByRole('button', { name: 'Crear trama' }).click();

}

async function delFullStory(page) {

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'delete' }).last().click();

  await page.getByRole('button', { name: 'Eliminar' }).click();

}

async function crearPersonaje(page) {

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole("button", { name: "personaje" }).click();

  await page.getByLabel("Nombre *").fill("Sherlock");

  await page.locator('input[name="primerApellido"]').fill("Holmes");

  await page.locator('input[name="segundoApellido"]').fill("Anderson");

  await page.locator('input[name="residencia"]').fill("Londres");

  await page.locator('input[name="altura"]').fill("180");

  await page
    .locator('input[name="url-icon"]')
    .fill(
      "https://creazilla-store.fra1.digitaloceanspaces.com/emojis/43381/detective-emoji-clipart-md.png"
    );

  await page.locator('input[name="genero"]').fill("Masculino");
  await page.locator('input[name="fechaNacimiento"]').fill('2000-12-04');

  await page.locator('input[name="lugarNacimiento"]').fill("Irlanda");

  await page.getByLabel("Descripción").fill("Buen detective");

  await page.getByRole('button', { name: 'Crear personaje' }).click();

}

test("testCrearEscena", async ({ page }) => {
  await login(page);

  await createFullStory(page);

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Añadir Escena' }).click()

  await page.getByLabel('Nombre de la escena *').fill("Encuentro");

  await page.getByLabel('Ubicación').fill("Londres");

  await page.getByLabel('Url de la música').fill("https://soundcloud.com/jameshypethedj/helicopter");

  await page.getByLabel('Fecha de la escena').fill("2000-12-04");

  await page.getByLabel('Descripción').fill("El inicio de la historia con Sherlock");

  await page.getByRole('button', { name: 'Crear escena' }).click();

  await expect(page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' })).toBeVisible();

  await delFullStory(page);


});


test("testCrearEscenaSiNombre", async ({ page }) => {
  await login(page);

  await createFullStory(page);

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Añadir Escena' }).click()

  await page.getByLabel('Nombre de la escena *').fill("");

  await page.getByLabel('Ubicación').fill("Londres");

  await page.getByLabel('Url de la música').fill("https://soundcloud.com/jameshypethedj/helicopter");

  await page.getByLabel('Fecha de la escena').fill("2000-12-04");

  await page.getByLabel('Descripción').fill("El inicio de la historia con Sherlock");

  await page.getByRole('button', { name: 'Crear escena' }).click();

  await expect(page.getByRole('heading', { name: 'Añadir escena' })).toBeVisible();

  await delFullStory(page);

});

test("testCrearEscenaConPersonaje", async ({ page }) => {
  await login(page);

  await createFullStory(page);

  await crearPersonaje(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Añadir Escena' }).click()

  await page.getByLabel('Nombre de la escena *').fill("Encuentro");

  await page.getByLabel('Ubicación').fill("Londres");

  await page.getByLabel('Url de la música').fill("https://soundcloud.com/jameshypethedj/helicopter");

  await page.getByLabel('Fecha de la escena').fill("2000-12-04");

  await page.getByLabel('Descripción').fill("El inicio de la historia con Sherlock");

  await page.getByRole('button', { name: 'Open' }).click();

  await page.getByRole('option', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Crear escena' }).click();

  await expect(page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last()).toBeVisible();


});


test("testVisualizarEscenas", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last().click()

  await expect(page.getByText('Ubicación de la escenaLondres')).toBeVisible();

  await expect(page.getByText('Fecha de la escena04-12-2000')).toBeVisible();

  await expect(page.getByText('DescripciónEl inicio de la historia con Sherlock')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Obtener contexto' })).toBeVisible();

  await expect(page.locator('div').filter({ hasText: /^Música de fondo$/ })).toBeVisible({ timeout: 10000 });

  await expect(page.getByRole('button', { name: 'Sherlock Buen detective' })).toBeVisible();
});

test("testEliminarEscena", async ({ page }) => {
  await login(page);

  await createScene(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last().click()

  await expect(page.getByText('Ubicación de la escenaLondres')).toBeVisible();

  await expect(page.getByText('Fecha de la escena04-12-2000')).toBeVisible();

  await expect(page.getByText('DescripciónEl inicio de la historia con Sherlock')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Obtener contexto' })).toBeVisible();

  await page.getByRole('button', { name: 'delete' }).click();

  await expect(page.getByRole('heading', { name: '¿Eliminar escena?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar la escena? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Eliminar' }).click();

  await expect(page.getByRole('button', { name: 'Añadir Escena' })).toBeVisible();


});

async function createScene(page) {

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Añadir Escena' }).click()

  await page.getByLabel('Nombre de la escena *').fill("Encuentro");

  await page.getByLabel('Ubicación').fill("Londres");

  await page.getByLabel('Url de la música').fill("https://soundcloud.com/jameshypethedj/helicopter");

  await page.getByLabel('Fecha de la escena').fill("2000-12-04");

  await page.getByLabel('Descripción').fill("El inicio de la historia con Sherlock");

  await page.getByRole('button', { name: 'Crear escena' }).click();

  await expect(page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last()).toBeVisible();

}


test("testEliminarEscenaCancel", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last().click()

  await expect(page.getByText('Ubicación de la escenaLondres')).toBeVisible();

  await expect(page.getByText('Fecha de la escena04-12-2000')).toBeVisible();

  await expect(page.getByText('DescripciónEl inicio de la historia con Sherlock')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Obtener contexto' })).toBeVisible();

  await page.getByRole('button', { name: 'delete' }).click();

  await expect(page.getByRole('heading', { name: '¿Eliminar escena?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar la escena? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar' }).click();

  await expect(page.getByText('¿Seguro de que desea eliminar la trama? Esta acción no se puede deshacer.')).toBeHidden();


});

test("testActualizarEscena", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last().click()

  await expect(page.getByText('Ubicación de la escenaLondres')).toBeVisible();

  await expect(page.getByText('Fecha de la escena04-12-2000')).toBeVisible();

  await expect(page.getByText('DescripciónEl inicio de la historia con Sherlock')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Obtener contexto' })).toBeVisible();

  await page.getByRole('button', { name: 'edit' }).click();

  expect((await page.getByLabel('Nombre de la escena *').inputValue()).toString()).toContain("Encuentro");

  expect((await page.getByLabel('Ubicación').inputValue()).toString()).toContain("Londres");

  expect((await page.getByLabel('Url de la música').inputValue()).toString()).toContain("https://soundcloud.com/jameshypethedj/helicopter");

  expect((await page.getByLabel('Fecha de la escena').inputValue()).toString()).toContain("2000-12-04");

  expect((await page.getByRole('button', { name: 'Sherlock' })).toString()).toContain("Sherlock");

  expect((await page.getByLabel('Descripción').inputValue()).toString()).toContain("El inicio de la historia con Sherlock");


  await page.getByLabel('Nombre de la escena *').fill("Un final a la altura");

  await page.getByLabel('Ubicación').fill("NY");

  await page.getByLabel('Url de la música').fill("");

  await page.getByLabel('Fecha de la escena').fill("2012-12-04");

  await page.getByRole('button', { name: 'Open' }).click();

  await page.getByRole('button', { name: 'Sherlock' }).click();

  await page.getByLabel('Descripción').fill("El final de la historia");

  await page.getByRole('button', { name: 'Actualizar escena' }).click();

  await expect(page.getByText('Ubicación de la escenaNY')).toBeVisible();

  await expect(page.getByText('Fecha de la escena04-12-2012')).toBeVisible();

  await expect(page.getByText('DescripciónEl final de la historia')).toBeVisible();

  await expect(page.locator('div').filter({ hasText: /^Música de fondo$/ })).toBeHidden({ timeout: 10000 });

});

test("testActualizarEscenaSinNombre", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Un final a la altura El final de la historia' }).last().click()


  await page.getByRole('button', { name: 'edit' }).click();

  await page.getByLabel('Nombre de la escena *').fill("");

  await page.getByLabel('Ubicación').fill("NY");

  await page.getByLabel('Url de la música').fill("");

  await page.getByLabel('Fecha de la escena').fill("2012-12-04");

  await page.getByLabel('Descripción').fill("El final de la historia");

  await page.getByRole('button', { name: 'Actualizar escena' }).click();

  await expect(page.getByRole('heading', { name: 'Actualizar escena' })).toBeVisible();

});



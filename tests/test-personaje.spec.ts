import { test, expect } from "@playwright/test";

let url = "http://localhost:8080";

async function login(page) {
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Correo electrónico *").fill("test@example.com");
  await page.getByLabel("Contraseña *").click();
  await page.getByLabel("Contraseña *").fill("test1234");
  await page.getByLabel("Contraseña *").press("Enter");
}
test("testPersonajes", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();
  await page.getByRole("heading", { name: "Personajes import" }).click();

  await expect(page.locator("html")).toContainText("Personajes");
  await expect(
    page.getByRole("heading", { name: "Personajes import" })
  ).toContainText("Personajes");
  await expect(
    page.getByRole("link", { name: "Mis personajes" })
  ).toContainText("Mis personajes");

  await expect(page.getByRole("button", { name: "Personaje" })).toContainText(
    "personaje"
  );
});

test("testCrearPersonajes", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole("button", { name: "personaje" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "personaje"
  );

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

  await expect((page.getByRole('button', { name: 'Sherlock' }).last())).toContainText("detective");

});


test("testCrearPersonajeClone", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole("button", { name: "personaje" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "personaje"
  );

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

  await expect((page.getByRole('button', { name: 'Sherlock' }).last())).toContainText("detective");

});




test("testCrearPersonajeInvalidoNombreVacio", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole("button", { name: "personaje" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "personaje"
  );

  await page.getByLabel("Nombre *").fill("");

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

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "personaje"
  );

});

test("testCrearPersonajeInvalidoAlturaNegativa", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole("button", { name: "personaje" }).click();

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "personaje"
  );

  await page.getByLabel("Nombre *").fill("Sherlcok");

  await page.locator('input[name="primerApellido"]').fill("Holmes");

  await page.locator('input[name="segundoApellido"]').fill("Anderson");

  await page.locator('input[name="residencia"]').fill("Londres");

  await page.locator('input[name="altura"]').fill("-180");

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

  await expect(page.getByRole("heading", { name: "Añadir" })).toContainText(
    "personaje"
  );

});

test("testVisualizarPersonaje", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await expect(page.getByText('Primer ApellidoHolmes')).toBeVisible();

  await expect(page.getByText('Segundo ApellidoAnderson')).toBeVisible();

  await expect(page.getByText('GéneroMasculino')).toBeVisible();

  await expect(page.getByText('ResidenciaLondres')).toBeVisible();

  await expect(page.getByText('Altura180 cm')).toBeVisible();

  await expect(page.getByText('Fecha de Nacimiento04-12-2000')).toBeVisible();

  await expect(page.getByText('Lugar de NacimientoIrlanda')).toBeVisible();

  await expect(page.getByText('DescripciónBuen detective')).toBeVisible();

});

async function createClone(page) {
  await login(page);

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

test("testEliminarPersonaje", async ({ page }) => {


  await login(page);

  await createClone(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'delete' }).click()

  await expect(page.getByRole('heading', { name: '¿Eliminar personaje?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar el personaje? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Eliminar' }).click();

  await expect(page.getByRole('button', { name: 'Importar de DBPedia' })).toBeVisible();


  

});

test("testEliminarPersonajeCancel", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'delete' }).click()

  await expect(page.getByRole('heading', { name: '¿Eliminar personaje?' })).toBeVisible();
  
  await expect(page.getByText('¿Seguro de que desea eliminar el personaje? Esta acción no se puede deshacer.')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Eliminar' })).toBeVisible();

  await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar' }).click();

  await expect(page.getByRole('heading', { name: '¿Eliminar personaje?' })).toBeHidden();

  await expect(page.getByRole('heading', { name: 'Personajes relacionados' })).toBeVisible();
  

});

test("testExportar", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'export' }).click();

  await expect(page.getByRole('alert')).toBeVisible();

  await expect(page.getByRole('alert')).toContainText("¡Archivo exportado con exito!");
  

});

test("testActualizar", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'edit' }).click();

  expect((await page.getByLabel("Nombre *").inputValue()).toString()).toContain("Sherlock");

  expect((await page.locator('input[name="primerApellido"]').inputValue()).toString()).toContain("Holmes");

  expect((await page.locator('input[name="segundoApellido"]').inputValue()).toString()).toContain("Anderson");

  expect((await page.locator('input[name="residencia"]').inputValue()).toString()).toContain("Londres");

  expect((await page.locator('input[name="altura"]').inputValue()).toString()).toContain("180");

  expect((await page.getByPlaceholder('https://cdn.webpage.com').inputValue()).toString()).toContain("creazilla");

  expect((await page.locator('input[name="genero"]').inputValue()).toString()).toContain("Masculino");
  expect((await page.locator('input[name="fechaNacimiento"]').inputValue()).toString()).toContain('2000-12-04');

  expect((await page.locator('input[name="lugarNacimiento"]').inputValue()).toString()).toContain("Irlanda");

  expect((await page.getByLabel("Descripción").inputValue()).toString()).toContain("Buen detective");



  await page.getByLabel("Nombre *").fill("John");

  await page.locator('input[name="primerApellido"]').fill("Watson");

  await page.locator('input[name="segundoApellido"]').fill("Watherbridge");

  await page.locator('input[name="residencia"]').fill("Dublin");

  await page.locator('input[name="altura"]').fill("160");

  await page.
  getByPlaceholder('https://cdn.webpage.com')
    .fill(
      "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/7766413/detective-with-magnifying-glass-clipart-md.png"
    );

  await page.locator('input[name="genero"]').fill("Masculino");
  await page.locator('input[name="fechaNacimiento"]').fill('1998-12-04');

  await page.locator('input[name="lugarNacimiento"]').fill("Norte America");

  await page.getByLabel("Descripción").fill("Gran compañero");

  await page.getByRole('button', { name: 'Actualizar personaje' }).click();

  await expect((page.getByRole('button', { name: 'John' }).last())).toContainText("compañero");

  await page.getByRole('button', { name: 'John' }).last().click();

  await expect(page.getByText('Primer ApellidoWatson')).toBeVisible();

  await expect(page.getByText('Segundo ApellidoWatherbridge')).toBeVisible();

  await expect(page.getByText('GéneroMasculino')).toBeVisible();

  await expect(page.getByText('ResidenciaDublin')).toBeVisible();

  await expect(page.getByText('Altura160 cm')).toBeVisible();

  await expect(page.getByText('Fecha de Nacimiento04-12-1998')).toBeVisible();

  await expect(page.getByText('Lugar de NacimientoNorte America')).toBeVisible();

  await expect(page.getByText('DescripciónGran compañero')).toBeVisible();

  

});

test("testActualizarNegativeNumber", async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'edit' }).click();

  expect((await page.getByLabel("Nombre *").inputValue()).toString()).toContain("Sherlock");

  expect((await page.locator('input[name="primerApellido"]').inputValue()).toString()).toContain("Holmes");

  expect((await page.locator('input[name="segundoApellido"]').inputValue()).toString()).toContain("Anderson");

  expect((await page.locator('input[name="residencia"]').inputValue()).toString()).toContain("Londres");

  expect((await page.locator('input[name="altura"]').inputValue()).toString()).toContain("180");

  expect((await page.getByPlaceholder('https://cdn.webpage.com').inputValue()).toString()).toContain("creazilla");

  expect((await page.locator('input[name="genero"]').inputValue()).toString()).toContain("Masculino");
  expect((await page.locator('input[name="fechaNacimiento"]').inputValue()).toString()).toContain('2000-12-04');

  expect((await page.locator('input[name="lugarNacimiento"]').inputValue()).toString()).toContain("Irlanda");

  expect((await page.getByLabel("Descripción").inputValue()).toString()).toContain("Buen detective");

  await page.getByLabel("Nombre *").fill("SherlockNegative");

  await page.locator('input[name="primerApellido"]').fill("Watson");

  await page.locator('input[name="segundoApellido"]').fill("Watherbridge");

  await page.locator('input[name="residencia"]').fill("Dublin");

  await page.locator('input[name="altura"]').fill("-160");

  await page.
  getByPlaceholder('https://cdn.webpage.com')
    .fill(
      "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/7766413/detective-with-magnifying-glass-clipart-md.png"
    );

  await page.locator('input[name="genero"]').fill("Masculino");
  await page.locator('input[name="fechaNacimiento"]').fill('1998-12-04');

  await page.locator('input[name="lugarNacimiento"]').fill("Norte America");

  await page.getByLabel("Descripción").fill("Gran compañero");

  await page.getByRole('button', { name: 'Actualizar personaje' }).click();

  await page.getByRole('button', { name: 'SherlockNegative' }).last().click();

  await expect(page.getByText('Altura')).toBeHidden();
  

});

test("testActualizarSinNombre", async ({ page }) => {

  await login(page);

  await createClone(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'edit' }).click();

  expect((await page.getByLabel("Nombre *").inputValue()).toString()).toContain("Sherlock");

  expect((await page.locator('input[name="primerApellido"]').inputValue()).toString()).toContain("Holmes");

  expect((await page.locator('input[name="segundoApellido"]').inputValue()).toString()).toContain("Anderson");

  expect((await page.locator('input[name="residencia"]').inputValue()).toString()).toContain("Londres");

  expect((await page.locator('input[name="altura"]').inputValue()).toString()).toContain("180");

  expect((await page.getByPlaceholder('https://cdn.webpage.com').inputValue()).toString()).toContain("creazilla");

  expect((await page.locator('input[name="genero"]').inputValue()).toString()).toContain("Masculino");
  expect((await page.locator('input[name="fechaNacimiento"]').inputValue()).toString()).toContain('2000-12-04');

  expect((await page.locator('input[name="lugarNacimiento"]').inputValue()).toString()).toContain("Irlanda");

  expect((await page.getByLabel("Descripción").inputValue()).toString()).toContain("Buen detective");

  await page.getByLabel("Nombre *").fill("");

  await page.locator('input[name="primerApellido"]').fill("Watson");

  await page.locator('input[name="segundoApellido"]').fill("Watherbridge");

  await page.locator('input[name="residencia"]').fill("Dublin");

  await page.locator('input[name="altura"]').fill("160");

  await page.
  getByPlaceholder('https://cdn.webpage.com')
    .fill(
      "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/7766413/detective-with-magnifying-glass-clipart-md.png"
    );

  await page.locator('input[name="genero"]').fill("Masculino");
  await page.locator('input[name="fechaNacimiento"]').fill('1998-12-04');

  await page.locator('input[name="lugarNacimiento"]').fill("Norte America");

  await page.getByLabel("Descripción").fill("Gran compañero");

  await page.getByRole('button', { name: 'Actualizar personaje' }).click();

  await expect(page.getByRole("heading", { name: "Actualizar" })).toContainText(
    "personaje"
  );



  
});


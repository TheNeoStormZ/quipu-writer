import { test, expect } from '@playwright/test';

let url = "http://localhost:8080";

async function login(page) {
  await page.goto(url + "/login");
  await page.getByLabel("Correo electronico *").fill("test@example.com");
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

  await page.getByRole('combobox', { name: 'Generos' }).fill("Misterio");

  await page.getByRole('combobox', { name: 'Generos' }).press("Enter");

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

async function crearEscena(page) {
  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Un nuevo comienzo Sherlock se embarca en una nueva aventura, una para la que puede que no esté completamente preparado' }).last().click();

  await page.getByRole('button', { name: 'Añadir Escena' }).click()

  await page.getByLabel('Nombre de la escena *').fill("Encuentro");

  await page.getByLabel('Ubicación').fill("Londres");

  await page.getByLabel('Url de la musica').fill("https://soundcloud.com/jameshypethedj/helicopter");

  await page.getByLabel('Fecha de la escena').fill("2000-12-04");

  await page.getByLabel('Descripción').fill("El inicio de la historia con Sherlock");

  await page.getByRole('button', { name: 'Open' }).click();

  await page.getByRole('option', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Crear escena' }).click();

  await expect(page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last()).toBeVisible();
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

async function crearPersonajeSecundario(page) {

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole("button", { name: "personaje" }).click();

  await page.getByLabel("Nombre *").fill("John");

  await page.locator('input[name="primerApellido"]').fill("Watson");

  await page.locator('input[name="segundoApellido"]').fill("");

  await page.locator('input[name="residencia"]').fill("UK");

  await page.locator('input[name="altura"]').fill("180");

  await page
    .locator('input[name="url-icon"]')
    .fill(
      "https://creazilla-store.fra1.digitaloceanspaces.com/emojis/43381/detective-emoji-clipart-md.png"
    );

  await page.locator('input[name="genero"]').fill("Masculino");
  await page.locator('input[name="fechaNacimiento"]').fill('2000-12-04');

  await page.locator('input[name="lugarNacimiento"]').fill("Irlanda");

  await page.getByLabel("Descripción").fill("Buen compañero");

  await page.getByRole('button', { name: 'Crear personaje' }).click();

}

async function crearPersonajeExtra(page) {

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole("button", { name: "personaje" }).click();

  await page.getByLabel("Nombre *").fill("Rndom");

  await page.getByRole('button', { name: 'Crear personaje' }).click();

}


test('testTimeLine', async ({ page }) => {

//TODO

});

test('testContext', async ({ page }) => {
  
  await login(page);

  await createFullStory(page);

  await crearPersonaje(page);

  await crearEscena(page);

  await page.getByRole('button', { name: 'Encuentro El inicio de la historia con Sherlock' }).last().click();

  await page.getByRole('button', { name: 'Obtener contexto' }).click();

  await expect(page.getByText('Contexto históricoInformación procedente de:EventoFecha Copa Intercontinental 20')).toBeVisible();




  });

test('testRelationshipsStory', async ({ page }) => {
  await login(page);

  await page.getByRole("link", { name: "Mis historias" }).click();

  await page.getByRole('button', { name: 'Las aventuras de Sherlock Holmes Sherlock se embarca en una aventura sin precedentes, a la cual deberá enfrentar con todos los medios a su disposición.' }).last().click();

  await page.getByRole('button', { name: 'Relaciones de personajes' }).click();

  await expect((page.getByRole('heading', { name: 'Grafo de relaciones' }))).toBeVisible();

  await expect((page.locator('canvas').first())).toBeVisible();


  });

  
test('testRelationshipsCharacterAddAndGraph', async ({ page }) => {
  await login(page);

  await crearPersonajeSecundario(page);

  await page.getByRole("link", { name: "Mis personajes" }).click();

  await page.getByRole('button', { name: 'Sherlock' }).last().click();

  await page.getByRole('button', { name: 'relation' }).click();

  await page.getByLabel('Fecha de la relacion').fill("2000-12-04");

  await page.getByLabel('Descripción').fill("Mejores amigos");

  await page.getByRole('button', { name: 'Open' }).click();

  await page.getByRole('option', { name: 'John' }).click();

  await page.getByRole('button', { name: 'Añadir relacion' }).click();

  await expect(page.locator('div').filter({ hasText: /^John$/ }).first()).toBeVisible();

  await page.getByRole('button', { name: 'relationGraph' }).click();

  await expect(page.locator('canvas').first()).toBeVisible();

  });

  test('testRelationshipsCharacterAddFail', async ({ page }) => {
    await login(page);
    
    await page.getByRole("link", { name: "Mis personajes" }).click();
  
    await page.getByRole('button', { name: 'Sherlock' }).last().click();
  
    await page.getByRole('button', { name: 'relation' ,exact:true}).click();
  
    await page.getByLabel('Fecha de la relacion').fill("2000-12-04");
  
    await page.getByLabel('Descripción').fill("Mejores amigos");
  
    await page.getByRole('button', { name: 'Añadir relacion' }).click();
    
    await expect(page.getByRole('alert')).toBeVisible();
  
    });
  

  
  test('testRelationshipsCharacterEdit', async ({ page }) => {

    await login(page);

    await crearPersonajeExtra(page);
  
    await page.getByRole("link", { name: "Mis personajes" }).click();
  
    await page.getByRole('button', { name: 'Sherlock' }).last().click();
  
    await page.getByRole('button', { name: 'relationDel' }).click();

    await expect(page.getByRole('cell', { name: 'Sherlock' })).toBeVisible();

    await page.getByRole('button', { name: 'Editar relaci' }).click();

    await page.getByRole('button', { name: 'Open' }).click();

    await page.getByRole('option', { name: 'Rndom' }).click();

    await page.getByRole('button', { name: 'Actualizar relacion' }).click();

    await expect(page.locator('div').filter({ hasText: /^Rndom$/ })).toBeVisible();

    });

  test('testRelationshipsCharacterDel', async ({ page }) => {

    await login(page);
  
    await page.getByRole("link", { name: "Mis personajes" }).click();
  
    await page.getByRole('button', { name: 'Sherlock' }).last().click();
  
    await page.getByRole('button', { name: 'relationDel' }).click();

    await expect(page.getByRole('cell', { name: 'Sherlock' })).toBeVisible();

    await page.getByRole('button', { name: 'Sacar de la relación' }).click();

    await expect(page.locator('div').filter({ hasText: /^Rndom$/ })).toBeHidden();
    });

    
  test('testRelationshipsCharacterEditFail', async ({ page }) => {

    await login(page);

    await crearPersonajeExtra(page);
  
    await page.getByRole("link", { name: "Mis personajes" }).click();
  
    await page.getByRole('button', { name: 'John' }).last().click();
  
    await page.getByRole('button', { name: 'relationDel' }).click();

    await page.getByRole('button', { name: 'Editar relaci' }).click();

    await page.getByLabel('Relaciones').press("Delete");

    await page.getByRole('button', { name: 'Clear' }).click();

    await page.getByRole('button', { name: 'Actualizar relacion' }).click();

    await expect(page.getByRole('alert')).toBeVisible();

    });
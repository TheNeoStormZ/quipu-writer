import { test, expect } from '@playwright/test';

let url = "http://localhost:8080";

test('testRegister', async ({ page }) => {
  await page.goto(url + '/login');
  await page.getByRole('link', { name: 'Registrarse' }).click();
  await page.getByLabel('Nombre de usuario *').fill('testuser');
  await page.getByLabel('Correo electronico *').fill('test@example.com');
  await page.getByLabel('Contraseña *', { exact: true }).fill('test1234');
  await page.getByLabel('Confirmar contraseña *').fill('test1234');
  await page.getByRole('button', { name: 'Resgitrarme' }).click();  
});

test('testRegisterNegative', async ({ page }) => {
  await page.goto(url + '/login');
  await page.getByRole('link', { name: 'Registrarse' }).click();
  await page.getByLabel('Nombre de usuario *').fill('testuser');
  await page.getByLabel('Correo electronico *').fill('test@example.com');
  await page.getByLabel('Contraseña *', { exact: true }).fill('test1234');
  await page.getByLabel('Confirmar contraseña *').fill('test1234');
  await page.getByRole('button', { name: 'Resgitrarme' }).click();  
  await expect(page.getByRole('alert')).toHaveText("Los datos son incorrectos");
});


test('testLogin', async ({ page }) => {
  await page.goto(url + '/login');
  await page.getByLabel('Correo electronico *').fill('test@example.com');
  await page.getByLabel('Contraseña *', { exact: true }).fill('test1234');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  
  await expect(page.locator('html')).toContainText("Historias");
  await expect(page.getByRole('heading', { name: 'Historias import' })).toContainText("Historias");
  await expect(page.getByRole('link', { name: 'Mis historias' })).toContainText("Mis historias");
  
});

test('testLoginNegative', async ({ page }) => {
  await page.goto(url + '/login');
  await page.getByLabel('Correo electronico *').fill('testfailed@example.com');
  await page.getByLabel('Contraseña *', { exact: true }).fill('test1234');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  
  await expect(page.getByRole('alert')).toHaveText("Los datos son incorrectos");
  
});
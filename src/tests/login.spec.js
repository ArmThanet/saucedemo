import { expect } from "@playwright/test";
import { test } from "../pages/base";
import { invalidUser, problemUser, validUser } from "../test-data/user";


test.describe("Login and Logout Function", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("TC001:Input fields should display as the data that was filled in", async ({
    loginPage,
  }) => {
    await loginPage.fillUserPass("testuser", "passuser");

    expect(await loginPage.getUsername()).toBe("testuser");
    expect(await loginPage.getPassword()).toBe("passuser");
  });

  test("TC002:Should show an error message if log in without a username", async ({
    loginPage,
  }) => {
    await loginPage.fillUserPass("", "passuser");

    await loginPage.clickLoginButton();

    const message = await loginPage.GetErrorMessage();

    expect(message).toContain("is required");
    expect(loginPage.isValidUrl()).toBe(true);
  });

  test("TC003:Should show an error message if log in without a password", async ({
    loginPage,
  }) => {
    await loginPage.fillUserPass("testuser", "");

    await loginPage.clickLoginButton();

    const message = await loginPage.GetErrorMessage();

    expect(message).toContain("is required");
    expect(loginPage.isValidUrl()).toBe(true);
  });
  test("TC004:Should show an error message if log in with both fields blank", async ({
    loginPage,
  }) => {
    await loginPage.fillUserPass("", "");

    await loginPage.clickLoginButton();

    const message = await loginPage.GetErrorMessage();

    expect(message).toContain("is required");
    expect(loginPage.isValidUrl()).toBe(true);
  });

  validUser.forEach(({ username, password }) => {
    test(`TC005:Should logged in successfully with valid credentials: ${username}`, async ({
      loginPage,
    }) => {
      await loginPage.fillUserPass(username, password);
      await loginPage.clickLoginButton();
      expect(await loginPage.GetErrorMessage()).not.toContain("is required");

      expect(loginPage.isValidUrl()).toBe(false);
    });
  });

  invalidUser.forEach(({ username, password }) => {
    test(`TC006:Should logged in fails with an error message when using invalid credentials ${username}`, async ({
      loginPage,
    }) => {
      await loginPage.fillUserPass(username, password);
      await loginPage.clickLoginButton();
      const message = await loginPage.GetErrorMessage();

      expect(message).toContain("Epic sadface");

      expect(loginPage.isValidUrl()).toBe(true);
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC031:when click "Logout" should navigate back to the Login Page
 ${username}`, async ({
      loginPage,
    }) => {
      await loginPage.fillUserPass(username, password);
      await loginPage.clickLoginButton();
      expect(await loginPage.GetErrorMessage()).not.toContain("is required");

      await loginPage.clickHambergerIcon();
      await loginPage.ClickLogout();

    });
  });
});

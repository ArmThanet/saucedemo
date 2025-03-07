import { expect } from "@playwright/test";
import { test } from "../pages/base";
import { validUser } from "../test-data/user";

test.describe("Home Page", () => {
  // Before each test, navigate to the login page
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  const navigateToCheckoutAndLogin = async (
    { loginPage, homePage, cartPage },
    username,
    password
  ) => {
    // Perform the login
    await loginPage.fillUserPass(username, password);
    await loginPage.clickLoginButton();
    // Ensure there are no error messages related to missing fields
    expect(await loginPage.GetErrorMessage()).not.toContain("is required");
    // Check if the URL is not the login page anymore
    expect(loginPage.isValidUrl()).toBe(false);
  };

  validUser.forEach(({ username, password }) => {
    test(`TC007:Adding all available products to the cart and then removing them, verifying that the cart updates correctly: ${username}`, async ({
      loginPage,
      homePage,
    }) => {
      await navigateToCheckoutAndLogin(
        { loginPage, homePage },
        username,
        password
      );

      // Click on the cart button
      await homePage.clickCartAddButton();

      await homePage.ClickremoveButton();
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC008:Product should correctly sorts items from A to Z: ${username}`, async ({
      loginPage,
      homePage,
    }) => {
      await navigateToCheckoutAndLogin(
        { loginPage, homePage },
        username,
        password
      );

      // Click on the cart button
      await homePage.clickSortAtoZ();
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC009:Product should correctly sorts items from Z to A: ${username}`, async ({
      loginPage,
      homePage,
    }) => {
      // Perform the login
      await navigateToCheckoutAndLogin(
        { loginPage, homePage },
        username,
        password
      );

      // Click on the cart button
      await homePage.clickSortZtoA();
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC010:Product should correctly sorts items from price low to high: ${username}`, async ({
      loginPage,
      homePage,
    }) => {
      // Perform the login
      await navigateToCheckoutAndLogin(
        { loginPage, homePage },
        username,
        password
      );

      // Click on the cart button
      await homePage.clickSortPrizeLtoH();
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC011:Product should correctly sorts items from price high to low: ${username}`, async ({
      loginPage,
      homePage,
    }) => {
      // Perform the login
      await navigateToCheckoutAndLogin(
        { loginPage, homePage },
        username,
        password
      );

      // Click on the cart button
      await homePage.clickSortPrizeHtoL();
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC012:Should navigate to the cart page when clicking the cart icon: ${username}`, async ({
      loginPage,
      homePage,
    }) => {
      // Perform the login
      await navigateToCheckoutAndLogin(
        { loginPage, homePage },
        username,
        password
      );

      // Click on the iconcart
      await homePage.clickIconCart();
    });
  });
});

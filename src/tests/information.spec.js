import { expect } from "@playwright/test";
import { test } from "../pages/base";
import { invalidUser, problemUser, validUser } from "../test-data/user";
import { checkurl } from "../utils";
import { info } from "../test-data/data-info";

test.describe("info Function", () => {
  // test.beforeEach(async ({ loginPage }) => {
  //     await loginPage.goto();
  // });

  const navigateToCheckoutAndLogin = async (
    { loginPage, homePage, cartPage },
    username,
    password
  ) => {
    await loginPage.goto();
    await loginPage.fillUserPass(username, password);
    await loginPage.clickLoginButton();
    expect(await loginPage.GetErrorMessage()).not.toContain("is required");
    await homePage.randomClickAddtoCart();
    await homePage.clickIconCart();
    await cartPage.clickCheckoutButton();
    expect(cartPage.isValidCartUrl()).toBe(false);
  };

  validUser.forEach(({ username, password }) => {
    test(`TC018: When clicking "Cancel", should navigate back to the cart page
: ${username}`, async ({ loginPage, homePage, cartPage, infoPage }) => {
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );
      await infoPage.clickCancelButton();
      expect(infoPage.isValidInfoUrl()).toBe(false);
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC019: When clicking "Continue" without any client information, should display an error message

: ${username}`, async ({ loginPage, homePage, cartPage, infoPage }) => {
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );

      await infoPage.clickContinueButton();
      expect(infoPage.isValidInfoUrl()).toBe(true);

      expect(await infoPage.GetErrorMessage()).toContain("is required");
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC020: When clicking "Continue" with some client information, should display an error message(enter FirstName): ${username}`, async ({
      loginPage,
      homePage,
      cartPage,
      infoPage,
    }) => {
      // Login action
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );

      const { firstName, lastName, zipcode } = info[0];
      // Fill the info and click continue button
      await infoPage.fillInfo(firstName, "", "");
      await infoPage.clickContinueButton();

      // Check if error message appears for missing information
      expect(infoPage.isValidInfoUrl()).toBe(true);
      expect(await infoPage.GetErrorMessage()).toContain("is required");
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC021: When clicking "Continue" with some client information, should display an error message(enter LastName): ${username}`, async ({
      loginPage,
      homePage,
      cartPage,
      infoPage,
    }) => {
      // Login action
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );

      const { firstName, lastName, zipcode } = info[0];
      // Fill the info and click continue button
      await infoPage.fillInfo("", lastName, "");
      await infoPage.clickContinueButton();

      // Check if error message appears for missing information
      expect(infoPage.isValidInfoUrl()).toBe(true);
      expect(await infoPage.GetErrorMessage()).toContain("is required");
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC022: When clicking "Continue" with some client information, should display an error message(enter zipcode): ${username}`, async ({
      loginPage,
      homePage,
      cartPage,
      infoPage,
    }) => {
      // Login action
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );

      const { firstName, lastName, zipcode } = info[0];
      // Fill the info and click continue button
      await infoPage.fillInfo("", "", zipcode);
      await infoPage.clickContinueButton();

      // Check if error message appears for missing information
      expect(infoPage.isValidInfoUrl()).toBe(true);
      expect(await infoPage.GetErrorMessage()).toContain("is required");
    });
  });

  validUser.forEach(({ username, password }) => {
    test.only(`TC023: When clicking "Continue" with some client information, should display an error message(enter FirstName and LastName): ${username}`, async ({
      loginPage,
      homePage,
      cartPage,
      infoPage,
    }) => {
      // Login action
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );

      const { firstName, lastName, zipcode } = info[0];
      // Fill the info and click continue button
      await infoPage.fillInfo(firstName, lastName, "");
      await infoPage.clickContinueButton();
      // Check if error message appears for missing information
      expect(await infoPage.GetErrorMessage()).toContain("is required");
      expect(infoPage.isValidInfoUrl()).toBe(true);
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC024: When clicking "Continue" with some client information, should display an error message(enter LastName and zipcode): ${username}`, async ({
      loginPage,
      homePage,
      cartPage,
      infoPage,
    }) => {
      // Login action
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );

      const { firstName, lastName, zipcode } = info[0];
      // Fill the info and click continue button
      await infoPage.fillInfo("", lastName, zipcode);
      await infoPage.clickContinueButton();
      // Check if error message appears for missing information
      expect(await infoPage.GetErrorMessage()).toContain("is required");
      expect(infoPage.isValidInfoUrl()).toBe(true);
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC025: When clicking "Continue" with all client information, should proceed to the checkout overview page
(enter alldata): ${username}`, async ({
      loginPage,
      homePage,
      cartPage,
      infoPage,
    }) => {
      // Login action
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage },
        username,
        password
      );

      const { firstName, lastName, zipcode } = info[0];
      // Fill the info and click continue button
      await infoPage.fillInfo(firstName, lastName, zipcode);
      await infoPage.clickContinueButton();
      // Check if error message appears for missing information
      expect(await infoPage.GetErrorMessage()).not.toContain("is required");
      expect(infoPage.isValidInfoUrl()).toBe(false);
    });
  });
});

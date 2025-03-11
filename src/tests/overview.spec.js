import { test } from "../pages/base";
import { invalidUser, problemUser, validUser } from "../test-data/user";
import { expect } from "@playwright/test";
import { info } from "../test-data/data-info";

const Precondition = async (
  { loginPage, homePage, cartPage, checkoutPage, infoPage },
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

  const { firstName, lastName, zipcode } = info[0];

  // Fill the info and click continue button
  await infoPage.fillInfo(firstName, lastName, zipcode);
  await infoPage.clickContinueButton();

  // Check if error message appears for missing information
  expect(await infoPage.GetErrorMessage()).not.toContain("is required");
  expect(infoPage.isValidInfoUrl()).toBe(false);
};

//When clicking "Cancel", should navigate back to the product page
validUser.forEach(({ username, password }) => {
  test(`TC027: When clicking "Cancel", should navigate back to the product page: ${username}`, async ({
    loginPage,
    homePage,
    cartPage,
    infoPage,
    checkoutPage,
    overviewPage,
  }) => {
    await Precondition(
      { loginPage, homePage, cartPage, checkoutPage, infoPage, overviewPage },
      username,
      password
    );
    await overviewPage.clickCancelButton();

    expect(overviewPage.isValidOverviewUrl()).toBe(false);
  });
});

  //When clicking "Cancel", should navigate back to the product page
  validUser.forEach(({ username, password }) => {
    test(`TC028: When clicking "Finish", should process to the checkout complete page: ${username}`, async ({
      loginPage,
      homePage,
      cartPage,
      infoPage,
      checkoutPage,
      overviewPage,
    }) => {
      await Precondition(
        { loginPage, homePage, cartPage, checkoutPage, infoPage, overviewPage },
        username,
        password
      );
      await overviewPage.clickFinishButton();

      expect(overviewPage.isValidOverviewUrl()).toBe(false);
    });
  });



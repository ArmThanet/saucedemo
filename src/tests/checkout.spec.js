import { expect } from "@playwright/test";
import { test } from "../pages/base";
import { invalidUser, problemUser, validUser } from "../test-data/user";
import { info } from "../test-data/data-info";

test.describe("Checkout Function", () => {

  // test.beforeEach(async ({ loginPage }) => {
  //     await loginPage.goto();
  // });

  const navigateToCheckoutAndLogin = async (
    { loginPage, homePage, cartPage ,checkoutPage,infoPage},
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
    
    await checkoutPage.clickFinishButton();
    expect(checkoutPage.isValidCheckoutUrl()).toBe(false);
};

validUser.forEach(({ username, password }) => {
    test(`TC029: The cart badge number should be removed

: ${username}`, async ({ loginPage, homePage, cartPage, infoPage,checkoutPage }) => {
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage ,checkoutPage,infoPage},
        username,
        password
      );
      //check item in cart all remove
      console.log(await cartPage.CountIteminCart());
      expect(await cartPage.CountIteminCart()).toBe(false);
        
      
    });
  });

  validUser.forEach(({ username, password }) => {
    test(`TC030: Display message complete order
: ${username}`, async ({ loginPage, homePage, cartPage, infoPage,checkoutPage }) => {
      await navigateToCheckoutAndLogin(
        { loginPage, homePage, cartPage ,checkoutPage,infoPage},
        username,
        password
      );
        expect(await checkoutPage.GetCheckoutCompleteMessage()).toContain("THANK YOU FOR YOUR ORDER");
      
    });
  });

});


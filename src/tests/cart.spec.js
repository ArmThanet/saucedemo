import { expect } from "@playwright/test";
import { test } from "../pages/base";
import { invalidUser, problemUser, validUser } from "../test-data/user";
import { checkurl } from "../utils";

test.describe("Cart Function", () => {

    // test.beforeEach(async ({ loginPage }) => {
    //     await loginPage.goto();
    // });

const navigateToCheckoutAndLogin = async ({ loginPage, homePage, cartPage }, username, password) => {
    await loginPage.goto();
    await loginPage.fillUserPass(username, password);
    await loginPage.clickLoginButton();
        // Ensure there are no error messages related to missing fields
    expect(await loginPage.GetErrorMessage()).not.toContain("is required");
        // Check if the URL is not the login page anymore
    expect(loginPage.isValidUrl()).toBe(false);
};

validUser.forEach(({ username, password }) => {
    test(`TC013:The cart badge should displays the correct number of items currently in the cart
: ${username}`, async ({ loginPage, homePage, cartPage }) => {
        // Perform the login
        await navigateToCheckoutAndLogin({ loginPage, homePage, cartPage }, username, password);

        await homePage.randomClickAddtoCart();

        // Click on the iconcart
        await homePage.clickIconCart();

        await cartPage.CountIteminCart();

        expect(await cartPage.CountIteminCart()).toBe(true);
    });
});

validUser.forEach(({ username, password }) => {
    test(`TC014: The item name and price in the cart should match the selection from the product page: ${username}`, async ({
        loginPage,
        homePage,
        cartPage,
    }) => {
        await navigateToCheckoutAndLogin({ loginPage, homePage, cartPage }, username, password);

        //รับค่า return จาก function randomClickAddtoCart จากหน้า homepage
        const clickedItems = await homePage.randomClickAddtoCart();

        // Click on the cart icon to view the cart
        await homePage.clickIconCart();

        // รับค่า return จาก function getCartItems จากหน้า informationPage
        const cartItems = await cartPage.getCartItems();
        //เช็คข้อมูลว่าตรงกันหรือไม่
        clickedItems.forEach((clickedItem, index) => {
            const cartItem = cartItems[index];
            expect(cartItem.name).toBe(clickedItem.name);
            expect(cartItem.price).toBe(clickedItem.price);
        });
    });
});

validUser.forEach(({ username, password }) => {
    test(`TC015: Should remove the selected item from the cart and update the cart badge: ${username}`, async ({
        loginPage,
        homePage,
        cartPage,
    }) => {
        await navigateToCheckoutAndLogin({ loginPage, homePage, cartPage }, username, password);

        //เลือก item และรับค่า
        await homePage.randomClickAddtoCart();

        // Click on the cart icon to view the cart
        await homePage.clickIconCart();

        //เก็บข้อมูลก่อนลบ
        const cartItemsBefore = await cartPage.getCartItems();
        //สุ่มลบ 1 item จาก cart
        await cartPage.clickRemoveButton();

        const cartItemsAfter = await cartPage.getCartItems();

        //เช็คว่า item ที่ลบออกไป ไม่มีอีกแล้ว
        expect(cartItemsAfter).not.toEqual(cartItemsBefore);

    });



});

validUser.forEach(({ username, password }) => {
    test(`TC016: Should remove the selected item from the cart and update the cart badge: ${username}`, async ({
        loginPage,
        homePage,
        cartPage,
    }) => {
        await navigateToCheckoutAndLogin({ loginPage, homePage, cartPage }, username, password);

        // Click on the cart icon to view the cart
        await homePage.clickIconCart();
        await cartPage.clickContinueShoppingButton();

        expect(cartPage.isValidCartUrl()).toBe(false);

    });
});

    validUser.forEach(({ username, password }) => {
        test(`TC017: When clicking "Checkout", should proceed to the checkout information page: ${username}`, async ({
            loginPage,
            homePage,
            cartPage,
        }) => {
            await navigateToCheckoutAndLogin({ loginPage, homePage, cartPage }, username, password);
    
            // Click on the cart icon to view the cart
            await homePage.clickIconCart();
            await cartPage.clickCheckoutButton();
    
            expect(cartPage.isValidCartUrl()).toBe(false);
    
        });



});

});




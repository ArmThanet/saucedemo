import { test as base } from "@playwright/test";
import { LoginPage } from "./login.page";
import { HomePage } from "./home.page";
import { CartPage } from "./cart.page";
import { InfoPage } from "./info.page";
import { CheckoutPage } from "./checkout.page";


type baseFixture= {
    loginPage: LoginPage,
    homePage: HomePage,
    cartPage: CartPage,
    infoPage : InfoPage,
    checkoutPage : CheckoutPage,
    
}
export const test= base.extend<baseFixture>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    infoPage: async ({ page }, use) => {
        await use(new InfoPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

});
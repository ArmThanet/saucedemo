import { Page } from "@playwright/test";
import { removeSlash } from "../utils";
export class CheckoutPage {
  baseUrl = "https://www.saucedemo.com/v1/checkout-step-two.html";

  locatorFinsihButton = ".btn_action.cart_button";

  locatorCheckoutComplete = ".checkout_complete_container";
  /**
   *
   * @param {Page} page
   */

  constructor(page) {
    this.page = page;
  }

  async clickFinishButton() {
    await this.page.click(this.locatorFinsihButton);
    console.log("Click on the finish button");
  }

  isValidCheckoutUrl() {
    const url = removeSlash(this.page.url());
    console.log("now:" + url);
    console.log("before:" + this.baseUrl);
    console.log(url === this.baseUrl);

    return url === this.baseUrl;
  }

  async GetCheckoutCompleteMessage() {
    try {
      return (
        console.log("checkout complete"),
        (await this.page
          .locator(this.locatorCheckoutComplete)
          .textContent({ timeout: 1000 })) || ""
      );
    } catch (error) {
      return "";
    }
  }

  
}

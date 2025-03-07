import { Page } from "@playwright/test";
import { removeDollarSign } from "../utils";
import { parse } from "path";
import { removeSlash } from "../utils";
import { info } from "../test-data/data-info";
// import

export class InfoPage {
  baseUrl = "https://www.saucedemo.com/v1/checkout-step-one.html";

  locatorCancel = ".cart_cancel_link.btn_secondary";
  locatorContinue = ".btn_primary.cart_button";

  locatormessageError = '[data-test="error"]';

  locatorFirstName = "#first-name";
  locatorLastName = "#last-name";
  locatorZipCode = "#postal-code";

  /**
   *
   * @param {Page} page
   */

  constructor(page) {
    this.page = page;
  }

  async clickCancelButton() {
    await this.page.click(this.locatorCancel);
    console.log("Click on the cancel button");
  }

  isValidInfoUrl() {
    const url = removeSlash(this.page.url());
    console.log("now:" + url);
    console.log("before:" + this.baseUrl);
    console.log(url === this.baseUrl);

    return url === this.baseUrl;
  }

  async clickContinueButton() {
    await this.page.click(this.locatorContinue);
    console.log("Click on the continue button");
  }

  async GetErrorMessage() {
    try {
      return (
        (await this.page
          .locator(this.locatormessageError)
          .textContent({ timeout: 1000 })) || ""
      );
    } catch (error) {
      return "";
    }
  }

  async fillInfo(firstName, lastName, zipcode) {
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Zip Code:", zipcode);

    await this.page.locator(this.locatorFirstName).fill(firstName);
    await this.page.locator(this.locatorLastName).fill(lastName);
    await this.page.locator(this.locatorZipCode).fill(zipcode);
  }
}

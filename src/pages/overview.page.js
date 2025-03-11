import { Page } from "@playwright/test";
import { removeSlash } from "../utils";
import { info } from "../test-data/data-info";
export class OverviewPage {

    baseUrl = "https://www.saucedemo.com/v1/checkout-step-two.html";
    
    locatorCancelButton = '.cart_cancel_link.btn_secondary';

     /**
   *
   * @param {Page} page
   */

  constructor(page) {
    this.page = page;
  }

  async clickCancelButton() {
    await this.page.click(this.locatorCancelButton);
    console.log("Click on the Cancel button");
  }

  async clickFinishButton() {
    await this.page.click(this.locatorFinsihButton);
    console.log("Click on the finish button");
  }

  isValidOverviewUrl() {
    const url = removeSlash(this.page.url());
    console.log("now:" + url);
    console.log("before:" + this.baseUrl);
    console.log(url === this.baseUrl);

    return url === this.baseUrl;
  }


}
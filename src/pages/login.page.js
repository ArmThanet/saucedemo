import { Page } from "@playwright/test";
import { removeSlash } from "../utils";

export class LoginPage {
  baseUrl = "https://www.saucedemo.com/v1";

  locatorusername = "#user-name";
  locatoruserpass = "#password";

  locatorbuttonLogin = "#login-button";

  locatormessageError = '[data-test="error"]';

  /**
   *
   * @param {Page} page
   */

  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.baseUrl);
  }

  async fillUserPass(username, password) {
    await this.page.locator(this.locatorusername).fill(username);
    await this.page.locator(this.locatoruserpass).fill(password);
  }

  async clickLoginButton() {
    await this.page.click(this.locatorbuttonLogin);
  }

  async getUsername() {
    return await this.page.locator(this.locatorusername).inputValue();
  }

  async getPassword() {
    return await this.page.locator(this.locatoruserpass).inputValue();
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

  isValidUrl() {
    const url = removeSlash(this.page.url());
    // console.log("1"+url);
    // console.log("2"+url, "3"+this.baseUrl , "4"+this.page.url());
    console.log(url === this.baseUrl);

    return url === this.baseUrl;
  }
}

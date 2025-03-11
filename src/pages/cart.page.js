import { Page } from "@playwright/test";
import { removeSlash } from "../utils";
// import

export class CartPage {
  baseUrl = "https://www.saucedemo.com/cart.html";

  locatorCountitem = ".fa-layers-counter";
  locatoritemInCart = ".inventory_item_name";
  locatoritemPrice = ".inventory_item_price";

  locatorRemoveButton = ".btn_secondary.cart_button";

  locatorContinueShoppingButton = ".btn_secondary";

  locatorCheckoutButton = ".btn_action.checkout_button";
  /**
   *
   * @param {Page} page
   */

  constructor(page) {
    this.page = page;
  }

  async CountIteminCart() {
    try {
        // ตรวจสอบก่อนว่า locator มีอยู่จริงหรือไม่
        const countItemElement = await this.page.$(this.locatorCountitem);
        
        // ถ้าไม่มี Element ให้ถือว่าจำนวนสินค้าเป็น 0
        if (!countItemElement) {
            console.log("ไม่มีสินค้าในตะกร้า");
            return false;
        }

        // อ่านค่าจากตัวเลขที่แสดง
        const countItemText = await countItemElement.textContent();
        const countItem = parseInt(countItemText, 10) || 0;

        // ดึงรายการสินค้าทั้งหมดในตะกร้า
        const itemInCart = await this.page.$$(this.locatoritemInCart);
        const itemInCartCount = itemInCart.length;

        console.log(
            `จำนวนสินค้าในตะกร้าตรงกันหรือไม่: ${countItem === itemInCartCount}`
        );

        return countItem === itemInCartCount;
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการตรวจสอบจำนวนสินค้าในตะกร้า:", error);
        return false;
    }
}


  async getCartItems() {
    const cartItemNames = await this.page.$$eval(
      this.locatoritemInCart,
      (items) => items.map((item) => item.textContent.trim())
    );
    const cartItemPrices = await this.page.$$eval(
      this.locatoritemPrice,
      (items) => items.map((item) => item.textContent.trim())
    );

    // Return an array of objects containing name and price
    const cartItems = cartItemNames.map((name, index) => ({
      name: name,
      price: cartItemPrices[index] || "0.00", // Handle missing prices gracefully
    }));

    return cartItems;
  }

  async clickRemoveButton() {
    // ค้นหาปุ่ม Remove ทั้งหมดในหน้า
    const removeButtons = await this.page.$$(this.locatorRemoveButton);
    console.log(`พบปุ่มทั้งหมด: ${removeButtons.length}`);

    if (removeButtons.length === 0) {
      console.log("ไม่พบปุ่ม");
      return;
    }

    // คลิกปุ่ม Remove ของรายการแรกในตะกร้า
    await removeButtons[0].click();
    console.log("คลิกปุ่ม Remove สำหรับรายการแรกในตะกร้า");
  }

  async clickContinueShoppingButton() {
    await this.page.click(this.locatorContinueShoppingButton);
    console.log("คลิกปุ่ม Continue Shopping");
  }

  isValidCartUrl() {
    const url = removeSlash(this.page.url());
    console.log("now:" + url);
    console.log("before:" + this.baseUrl);
    console.log(url === this.baseUrl);

    return url === this.baseUrl;
  }

  async clickCheckoutButton() {
    await this.page.click(this.locatorCheckoutButton);
    console.log("Click on the checkout button");
  }
}

import { Page } from "@playwright/test";
import { removeDollarSign } from "../utils";
import { it } from "node:test";
// import

export class HomePage {
  baseUrl = "https://www.saucedemo.com/v1";

  locatorAddcart = ".btn_primary.btn_inventory";
  locatorRemovecart = ".btn_secondary.btn_inventory";

  locatorsort = ".product_sort_container";

  locatorvalueAtoZ = "az";
  locatorvalueZtoA = "za";
  locatorvalueHtoL = "hilo";
  locatorvalueLtoH = "lohi";

  localtorIconcart = '[data-icon="shopping-cart"]';

  locatorCountitem = ".fa-layers-counter";

  locatoritemInCart = ".inventory_item_name";
  locatorPriceInCart = ".inventory_item_price";

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
  //clcik on the cart button all the products
  async clickCartAddButton() {
    const buttons = await this.page.$$(this.locatorAddcart); // ค้นหาปุ่มทั้งหมด
    console.log(`พบปุ่มทั้งหมด: ${buttons.length}`);

    if (buttons.length === 0) {
      console.log("ไม่พบปุ่ม");
      return;
    }
    for (const button of buttons) {
      await button.click(); // คลิกปุ่มที่แสดงและใช้งานได้
    }
    console.log("คลิกปุ่ม Add ทั้งหมดเรียบร้อยแล้ว");
  }

  async ClickremoveButton() {
    const buttons = await this.page.$$(this.locatorRemovecart); // ค้นหาปุ่มทั้งหมด
    console.log(`พบปุ่มทั้งหมด: ${buttons.length}`);
    if (buttons.length === 0) {
      console.log("ไม่พบปุ่ม");
      return;
    }
    for (const button of buttons) {
      await button.click(); // คลิกปุ่มที่แสดงและใช้งานได้
    }
    console.log("คลิกปุ่ม Remove ทั้งหมดเรียบร้อยแล้ว");
  }

  async clickSortAtoZ() {
    await this.page.selectOption(this.locatorsort, {
      value: this.locatorvalueAtoZ,
    });
  }

  async clickSortZtoA() {
    await this.page.selectOption(this.locatorsort, {
      value: this.locatorvalueZtoA,
    });
  }

  async clickSortPrizeHtoL() {
    await this.page.selectOption(this.locatorsort, {
      value: this.locatorvalueHtoL,
    });
  }

  async clickSortPrizeLtoH() {
    await this.page.selectOption(this.locatorsort, {
      value: this.locatorvalueLtoH,
    });
  }

  async clickIconCart() {
    await this.page.click(this.localtorIconcart);
  }

  async randomClickAddtoCart() {
    // ดึงปุ่ม Add to Cart ทั้งหมด
    const buttons = await this.page.$$(this.locatorAddcart);
    console.log(`พบปุ่มทั้งหมด: ${buttons.length}`);

    if (buttons.length === 0) {
      console.log("ไม่พบปุ่ม");
      return;
    }

    // กำหนดจำนวนสินค้าที่จะคลิก (อย่างน้อย 2 รายการ หรือทั้งหมดถ้ามีน้อยกว่า 2)
    const numClicks = Math.min(2, buttons.length);
    const clickedIndices = new Set();
    let itemsClicked = [];

    // คลิกสุ่มปุ่ม Add to Cart
    while (clickedIndices.size < numClicks) {
      const randomIndex = Math.floor(Math.random() * buttons.length);
      if (!clickedIndices.has(randomIndex)) {
        await buttons[randomIndex].click();
        clickedIndices.add(randomIndex);

        // รอให้การคลิกสินค้าเสร็จสมบูรณ์
        await this.page.waitForTimeout(500); // หรือใช้ waitForSelector()

        // ใช้ locators เพื่อดึงชื่อสินค้าและราคา โดยใช้ index ของสินค้าที่คลิก
        const itemName = await this.page.textContent(
          `.inventory_item:nth-child(${randomIndex + 1}) .inventory_item_name`
        );
        const itemPrice = await this.page.textContent(
          `.inventory_item:nth-child(${randomIndex + 1}) .inventory_item_price`
        );

        //remove dollor sign
        console.log(`1.${itemPrice.trim()}`);
        const itemPrices = removeDollarSign(itemPrice.trim());
        console.log(`2.+${itemPrices}`);
        // เก็บข้อมูลที่ดึงมา

        itemsClicked.push({ name: itemName.trim(), price: itemPrices });
        console.log(`คลิกปุ่ม Add สินค้าสุ่มที่ index: ${randomIndex}`);
        console.log(`ชื่อสินค้า: ${itemName}, ราคา: ${itemPrices}`);
      }
    }

    // คืนค่ารายการสินค้าที่ถูกคลิก
    return itemsClicked;
  }
}

const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const assert = require("assert");
const {waitForUrl} = require("selenium-webdriver/http/util");

(async function my_test() {
    try {
        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .build();

        // open login page
        await driver.get('https://app.clooney-conferencing.com/login/sign-in');

        // find and click "Sign-up here" button, and navigate to the new tab it should open
        let sign_up = await driver.wait(until.elementLocated(By.partialLinkText('Sign-up here')), 30000)
        const originalWindow = await driver.getWindowHandle();
        assert((await driver.getAllWindowHandles()).length === 1); // there should be only one tab open
        await sign_up.click();

        // switch to the new tab
        await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 10000);
        const windows = await driver.getAllWindowHandles();
        windows.forEach(async handle => {
            if (handle !== originalWindow) {
                await driver.switchTo().window(handle);
            }
        });

        // wait for the new tab, then check url
        await driver.wait(async () => (await driver.getWindowHandle()) !== originalWindow, 10000);
        assert.equal(await driver.getCurrentUrl(), 'https://app.clooney-conferencing.com/sign-up');

    } catch (e) {
        console.log(e);
    } finally {
        await driver.quit();
        console.log("test complete");
    }
}())
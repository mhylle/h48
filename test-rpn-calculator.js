const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const screenshotDir = path.join(__dirname, 'logs', 'screenshots');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  try {
    console.log('STATUS: EXECUTING');
    console.log('');

    // Step 1: Navigate and check page loads
    console.log('STEP 1: Loading page...');
    await page.goto('file:///C:/projects/agentic_learning/statr/index.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Check display and buttons visible
    const display = await page.locator('.display').isVisible();
    const buttons = await page.locator('button').count();
    console.log(`Display visible: ${display}`);
    console.log(`Button count: ${buttons}`);

    await page.screenshot({
      path: path.join(screenshotDir, `${timestamp}-step1-page-loaded.png`),
      fullPage: true
    });
    console.log(`Screenshot: ${path.join(screenshotDir, `${timestamp}-step1-page-loaded.png`)}`);
    console.log('');

    // Step 2: Click 5, ENTER, 3, +
    console.log('STEP 2: Clicking 5, ENTER, 3, +...');
    await page.click('button[data-value="5"]');
    await page.waitForTimeout(200);
    await page.click('button[data-action="enter"]');
    await page.waitForTimeout(200);
    await page.click('button[data-value="3"]');
    await page.waitForTimeout(200);
    await page.click('button[data-action="add"]');
    await page.waitForTimeout(500);

    // Check X register shows 8
    const xRegister = await page.locator('#stack-x .value').textContent();
    console.log(`X register value: ${xRegister}`);

    await page.screenshot({
      path: path.join(screenshotDir, `${timestamp}-step2-calculation.png`),
      fullPage: true
    });
    console.log(`Screenshot: ${path.join(screenshotDir, `${timestamp}-step2-calculation.png`)}`);
    console.log('');

    // Step 3: Check history entry
    console.log('STEP 3: Checking history entry...');
    await page.waitForTimeout(300);
    const historyEntries = await page.locator('#history-list .history-entry').count();
    console.log(`History entries count: ${historyEntries}`);

    if (historyEntries > 0) {
      const historyText = await page.locator('#history-list .history-entry').first().textContent();
      console.log(`History entry text: ${historyText}`);
    }

    await page.screenshot({
      path: path.join(screenshotDir, `${timestamp}-step3-history.png`),
      fullPage: true
    });
    console.log(`Screenshot: ${path.join(screenshotDir, `${timestamp}-step3-history.png`)}`);
    console.log('');

    // Step 4: Click history entry
    console.log('STEP 4: Clicking history entry...');
    if (historyEntries > 0) {
      await page.locator('#history-list .history-entry').first().click();
      await page.waitForTimeout(500);

      const xRegisterAfter = await page.locator('#stack-x .value').textContent();
      console.log(`X register after history click: ${xRegisterAfter}`);
    }

    await page.screenshot({
      path: path.join(screenshotDir, `${timestamp}-step4-history-click.png`),
      fullPage: true
    });
    console.log(`Screenshot: ${path.join(screenshotDir, `${timestamp}-step4-history-click.png`)}`);
    console.log('');

    // Step 5: Keyboard test - press 'p' for pi, then 's' for sin
    console.log('STEP 5: Testing keyboard - p for pi, s for sin...');
    await page.keyboard.press('p');
    await page.waitForTimeout(300);

    const xRegisterPi = await page.locator('#stack-x .value').textContent();
    console.log(`X register after 'p' (pi): ${xRegisterPi}`);

    await page.keyboard.press('s');
    await page.waitForTimeout(500);

    const xRegisterSin = await page.locator('#stack-x .value').textContent();
    console.log(`X register after 's' (sin): ${xRegisterSin}`);

    await page.screenshot({
      path: path.join(screenshotDir, `${timestamp}-step5-keyboard.png`),
      fullPage: true
    });
    console.log(`Screenshot: ${path.join(screenshotDir, `${timestamp}-step5-keyboard.png`)}`);
    console.log('');

    // Final evaluation
    console.log('EVALUATION:');
    console.log(`- Step 2 expected X=8, got: ${xRegister}`);
    console.log(`- Step 3 expected history entry, found: ${historyEntries > 0}`);
    console.log(`- Step 5 expected sin(pi)≈0, got: ${xRegisterSin}`);

    const step2Pass = xRegister?.trim() === '8';
    const step3Pass = historyEntries > 0;
    const sinValue = parseFloat(xRegisterSin);
    const step5Pass = !isNaN(sinValue) && Math.abs(sinValue) < 0.01;

    if (step2Pass && step3Pass && step5Pass) {
      console.log('');
      console.log('STATUS: PASS');
    } else {
      console.log('');
      console.log('STATUS: FAIL');
      if (!step2Pass) console.log('FAILURE: Step 2 - X register did not show 8');
      if (!step3Pass) console.log('FAILURE: Step 3 - No history entry created');
      if (!step5Pass) console.log('FAILURE: Step 5 - sin(pi) not close to 0');
    }

  } catch (error) {
    console.error('ERROR:', error.message);
    await page.screenshot({
      path: path.join(screenshotDir, `${timestamp}-error.png`),
      fullPage: true
    });
    console.log('STATUS: FAIL');
  } finally {
    await browser.close();
  }
})();

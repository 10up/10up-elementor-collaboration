import { parallelTest as test } from '../../../parallelTest';
import WpAdminPage from '../../../pages/wp-admin-page';
import FloatingElementPage from './floating-element-page';
import { expect } from '@playwright/test';
test.describe( 'Floating Elements tests', () => {
	test.beforeAll( async ( { browser, apiRequests }, testInfo ) => {
		const page = await browser.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );
		await wpAdmin.setExperiments( {
			container: 'active',
			'floating-bars': 'active',
		} );

		await page.close();
	} );

	test.afterAll( async ( { browser, apiRequests }, testInfo ) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo, apiRequests );
		await wpAdmin.resetExperiments();

		await page.close();
	} );

	test( 'Verify admin page exists when experiment is active', async ( {
		page,
		apiRequests,
	}, testInfo ) => {
		const floatingElPage = new FloatingElementPage( page, testInfo, apiRequests );
		await floatingElPage.goToFloatingButtonsEmptyPage();

		const addNewButtonId = '#elementor-template-library-add-new';

		await test.step( 'Check that buttons and top bar exists', async () => {
			const addNewButton = page.locator( addNewButtonId );
			await expect.soft( addNewButton ).toBeVisible();
			const topBar = page.locator( '#e-admin-top-bar-root' );
			await expect.soft( topBar ).toBeVisible();
		} );
	} );
} );

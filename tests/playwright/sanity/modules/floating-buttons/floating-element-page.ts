import WpAdminPage from '../../../pages/wp-admin-page';
export default class FloatingElementPage extends WpAdminPage {
	async goToFloatingButtonsEmptyPage() {
		await this.page.goto(
			'/wp-admin/edit.php?post_type=elementor_library&page=e-floating-buttons',
		);
	}
}

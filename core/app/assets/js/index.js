import App from './app';
import { Module as SiteEditor } from '@elementor/site-editor';
import ImportExport from '../../modules/import-export/assts/js/module';

new SiteEditor();
new ImportExport();

//const AppWrapper = elementorCommon.config.isDebug ? React.StrictMode : React.Fragment;
const AppWrapper = React.Fragment;

ReactDOM.render(
	<AppWrapper>
		<App />
	</AppWrapper>,
  document.getElementById( 'e-app' )
);

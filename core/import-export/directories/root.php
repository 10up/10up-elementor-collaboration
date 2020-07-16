<?php

namespace Elementor\Core\Import_Export\Directories;

use Elementor\Core\Import_Export\Manager;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Root extends Base {

	protected function get_name() {
		return '';
	}

	protected function export() {
		$kit = Plugin::$instance->kits_manager->get_active_kit();

		$include = $this->exporter->get_settings( 'include' );

		$include_kit_settings = in_array( 'settings', $include );

		if ( $include_kit_settings ) {
			$this->exporter->add_json_file( 'kit', $kit->get_export_data() );
		}

		$kit_post = $kit->get_post();

		$manifest_data = [
			'author' => get_the_author_meta( 'display_name', $kit_post->post_author ),
			'version' => Manager::FORMAT_VERSION,
			'elementor_version' => ELEMENTOR_VERSION,
			'created' => date( 'Y-m-d H:i:s' ),
			'title' => $this->exporter->get_settings( 'title' ),
			'description' => $kit_post->post_excerpt,
			'image' => get_the_post_thumbnail_url( $kit_post ),
		];

		if ( $include_kit_settings ) {
			$manifest_data['settings'] = array_keys( $kit->get_tabs() );
		}

		return $manifest_data;
	}

	protected function get_default_sub_directories() {
		return [
			new Templates( $this->exporter, $this ),
			new Content( $this->exporter, $this ),
		];
	}
}

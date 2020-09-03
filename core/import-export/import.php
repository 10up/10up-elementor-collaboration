<?php
namespace Elementor\Core\Import_Export;

use Elementor\Core\Import_Export\Directories\Root;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Import extends Iterator {

	private $files_base_dir;

	final protected function run() {
		$wp_upload_dir = wp_upload_dir();

		$this->files_base_dir = $wp_upload_dir['basedir'] . '/elementor/tmp/kit/';

		$zip = new \ZipArchive();

		$zip->open( $_FILES['file']['tmp_name'] );

		$zip->extractTo( $this->files_base_dir );

		$settings = $this->read_json_file( 'manifest' );

		$root_directory = new Root( $this );

		$root_directory->run_import( $settings );

		rmdir( $this->files_base_dir );
	}

	final protected function read_json_file( $name ) {
		$full_file_name = $this->files_base_dir . $this->get_archive_file_path( $name . '.json' );

		return json_decode( file_get_contents( $full_file_name ), true );
	}
}

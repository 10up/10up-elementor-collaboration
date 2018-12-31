/* global ElementorScreenshotConfig, elementorCommon */
var ScreenshotModule = function() {
	var createScreenshot = function() {
		var $elementor = jQuery( ElementorScreenshotConfig.selector );

		if ( ! $elementor.length ) {
			console.log( 'Screenshots: Elementor content was not found.' );
			return;
		}

		html2canvas( document.querySelector( ElementorScreenshotConfig.selector ), {
			useCORS: true,
			foreignObjectRendering: true,
		} ).then( function( canvas ) {
			var cropCanvas = document.createElement( 'canvas' ),
				cropContext = cropCanvas.getContext( '2d' ),
				ratio = 500 / canvas.width;

			cropCanvas.width = 500;
			cropCanvas.height = 700;

			// jQuery( 'body' ) .append( renderResult.image );

			cropContext.drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * ratio, canvas.height * ratio );

			elementorCommon.ajax.addRequest( 'screenshot_save', {
				data: {
					post_id: elementorFrontendConfig.post.id,
					screenshot: cropCanvas.toDataURL( 'image/png' ),
				},
			} );
		} );
	};

	var screenshotProxy = function( url ) {
		url = ElementorScreenshotConfig.home_url + '?screenshot_proxy&nonce=' + ElementorScreenshotConfig.nonce + '&href=' + url;

		return url;
	};

	var init = function() {
		jQuery( function() {
			var $elementor = jQuery( ElementorScreenshotConfig.selector );

			// Iframes cannot be captured.
			$elementor.find( 'iframe' ).each( function() {
				var $iframe = jQuery( this ),
					$iframeMask = jQuery( '<div />', {
						css: {
							background: 'gray',
							width: $iframe.width(),
							height: $iframe.height(),
						},
					} );

				if ( $iframe.next().is( '.elementor-custom-embed-image-overlay' ) ) {
					var regex = /url\(\"(.*)\"/gm;
					var url = $iframe.next().css( 'backgroundImage' );
					var matches = regex.exec( url );

					$iframeMask.css( {
						background: $iframe.next().css( 'background' )
					} );

					$iframeMask.append( jQuery( '<img />', {
						src: matches[ 1 ],
						css: {
							width: $iframe.width(),
							height: $iframe.height(),
						},
					} ) );

					$iframe.next().remove();
				} else if ( -1 !== $iframe.attr( 'src' ).search( 'youtu' ) ) {
					var regex = /^.*(?:youtu.be\/|youtube(?:-nocookie)?.com\/(?:(?:watch)??(?:.*&)?vi?=|(?:embed|v|vi|user)\/))([^?&"'>]+)/;
					var matches = regex.exec( $iframe.attr( 'src' ) );

					$iframeMask.append( jQuery( '<img />', {
						src: screenshotProxy( 'https://img.youtube.com/vi/' + matches[1] + '/0.jpg' ),
						crossOrigin: 'Anonymous',
						css: {
							width: $iframe.width(),
							height: $iframe.height(),
						},
					} ) );
				}

				$iframe.before( $iframeMask );
				$iframe.remove();
			} );

			$elementor.find( '.elementor-slides' ).each( function() {
				var $this = jQuery( this );
				$this.attr( 'data-slider_options', $this.attr( 'data-slider_options' ).replace( '"autoplay":true', '"autoplay":false' ) );
			} );

			setTimeout( createScreenshot, 5000 );
		} );
	};

	init();
};

new ScreenshotModule();

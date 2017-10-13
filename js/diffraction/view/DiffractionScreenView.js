// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var SceneryImage = require( 'SCENERY/nodes/Image' ); // eslint-disable-line require-statement-match
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {WaveInterferenceModel} diffractionModel
   * @constructor
   */
  function DiffractionScreenView( diffractionModel ) {

    var self = this;
    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        diffractionModel.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    var leftPanel = new Rectangle( 0, 0, 100, 100, { stroke: 'black' } );
    this.addChild( leftPanel );

    var rightPanel = new Rectangle( 120, 0, 100, 100, { stroke: 'black' } );
    this.addChild( rightPanel );

    // Usage code from JS-Fourier-Image-Analysis/js/main.js
    var dims = [ 512, 512 ]; // will be set later
    var cc = 9e-3; // contrast constant
    var apertureCanvas;
    var diffractionCanvas;
    var diffractionContext;

    var start = +new Date();
    // make each canvas the image's exact size
    apertureCanvas = document.createElement( 'canvas' );
    apertureCanvas.width = dims[ 0 ];
    apertureCanvas.height = dims[ 1 ];
    var apertureContext = apertureCanvas.getContext( '2d' );

    diffractionCanvas = document.createElement( 'canvas' );
    diffractionCanvas.width = dims[ 0 ];
    diffractionCanvas.height = dims[ 1 ];
    diffractionContext = diffractionCanvas.getContext( '2d' );

    apertureContext.fillStyle = 'white';
    apertureContext.fillRect( 0, 0, 10, 10 );

    // grab the pixels
    var imageData = apertureContext.getImageData( 0, 0, dims[ 0 ], dims[ 1 ] );
    var h_es = []; // the h values
    for ( var ai = 0; ai < imageData.data.length; ai += 4 ) {

      // greyscale, so you only need every 4th value
      h_es.push( imageData.data[ ai ] );
    }

    // initialize the h values
    var h = function( n, m ) {
      if ( arguments.length === 0 ) {
        return h_es;
      }

      var idx = n * dims[ 0 ] + m;
      return h_es[ idx ];
    }; // make it a function so the code matches the math

    var duration = +new Date() - start;
    console.log( 'It took ' + duration + 'ms to draw the image.' );

    start = +new Date();

    // compute the h hat values
    var h_hats = [];
    Fourier.transform( h(), h_hats );
    h_hats = Fourier.shift( h_hats, dims );

    // get the largest magnitude
    var maxMagnitude = 0;
    for ( ai = 0; ai < h_hats.length; ai++ ) {
      var mag = h_hats[ ai ].magnitude();
      if ( mag > maxMagnitude ) {
        maxMagnitude = mag;
      }
    }

    Fourier.filter( h_hats, dims, NaN, NaN );

    // store them in a nice function to match the math
    var $h = function( k, l ) {
      if ( arguments.length === 0 ) {
        return h_hats;
      }

      var idx = k * dims[ 0 ] + l;
      return h_hats[ idx ];
    };

    // draw the pixels
    var currImageData = diffractionContext.getImageData( 0, 0, dims[ 0 ], dims[ 1 ] );
    var logOfMaxMag = Math.log( cc * maxMagnitude + 1 );
    for ( var k = 0; k < dims[ 1 ]; k++ ) {
      for ( var l = 0; l < dims[ 0 ]; l++ ) {
        var idxInPixels = 4 * (dims[ 0 ] * k + l);
        currImageData.data[ idxInPixels + 3 ] = 255; // full alpha
        var color = Math.log( cc * $h( k, l ).magnitude() + 1 );
        color = Math.round( 255 * (color / logOfMaxMag) );
        // RGB are the same -> gray
        for ( var c = 0; c < 3; c++ ) { // lol c++
          currImageData.data[ idxInPixels + c ] = color;
        }
      }
    }
    diffractionContext.putImageData( currImageData, 0, 0 );

    var image = new SceneryImage( diffractionCanvas );
    self.addChild( image );

    duration = +new Date() - start;
    console.log( 'It took ' + duration + 'ms to compute the FT.' );
  }

  waveInterference.register( 'DiffractionScreenView', DiffractionScreenView );

  return inherit( ScreenView, DiffractionScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );
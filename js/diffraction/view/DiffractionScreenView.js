// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SceneryImage = require( 'SCENERY/nodes/Image' ); // eslint-disable-line require-statement-match
  var ScreenView = require( 'JOIST/ScreenView' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var width = 256;
  var height = width;

  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} sigmaX
   * @param {number} sigmaY
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  function gaussian( x0, y0, sigmaX, sigmaY, x, y ) {
    var dx = x - x0;
    var dy = y - y0;
    var a = dx * dx / sigmaX / sigmaX;
    var b = dy * dy / sigmaY / sigmaY;
    return Math.pow( Math.E, -(a + b) / 2 );
  }

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

    this.sceneProperty = new Property( 'rectangle' );
    var toggleButtonsContent = [ {
      value: 'rectangle',
      node: new Rectangle( 0, 0, 20, 20, { fill: 'black' } )
    }, {
      value: 'circle',
      node: new Circle( 10, { fill: 'black' } )
    } ];
    var radioButtonGroup = new RadioButtonGroup( this.sceneProperty, toggleButtonsContent );

    var placeholderImage = document.createElement( 'canvas' );
    placeholderImage.width = width;
    placeholderImage.height = height;

    var imageScale = 2;
    this.apertureImage = new SceneryImage( placeholderImage, { scale: imageScale } );
    self.addChild( this.apertureImage );

    this.diffractionImage = new SceneryImage( placeholderImage, { x: width * imageScale + 2, scale: imageScale } );
    self.addChild( this.diffractionImage );

    this.sceneProperty.link( function() {self.updateCanvases();} );

    this.addChild( radioButtonGroup );
  }

  waveInterference.register( 'DiffractionScreenView', DiffractionScreenView );

  return inherit( ScreenView, DiffractionScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    },

    updateCanvases: function() {

      // Usage code from JS-Fourier-Image-Analysis/js/main.js
      var dims = [ width, height ]; // will be set later
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

      apertureContext.fillStyle = 'black';
      apertureContext.fillRect( 0, 0, width, height );

      apertureContext.fillStyle = 'white';

      if ( this.sceneProperty.value === 'rectangle' ) {
        var rectWidth = 10;
        var rectHeight = 10;
        apertureContext.fillRect( width / 2 - rectWidth / 2, width / 2 - rectHeight / 2, rectWidth, rectHeight );
      }
      else if ( this.sceneProperty.value === 'circle' ) {
        for ( var i = 0; i < width; i++ ) {
          for ( var k = 0; k < height; k++ ) {
            var v = Util.clamp( Math.floor( gaussian( width / 2, height / 2, 20, 20, i, k ) * 400 ), 0, 255 );
            apertureContext.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
            apertureContext.fillRect( i, k, 1, 1 );
          }
        }
      }

      // circle
      // apertureContext.beginPath();
      // apertureContext.arc( 75, 75, 5, 0, 2 * Math.PI );
      // apertureContext.fill();

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
      for ( k = 0; k < dims[ 1 ]; k++ ) {
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

      this.apertureImage.image = apertureCanvas;
      this.diffractionImage.image = diffractionCanvas;

      duration = +new Date() - start;
      console.log( 'It took ' + duration + 'ms to compute the FT.' );
    }
  } );
} );
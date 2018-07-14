// Copyright 2017, University of Colorado Boulder

/**
 * Screen for the Diffraction screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const DiffractionModel = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionModel' );
  const DiffractionScreenView = require( 'WAVE_INTERFERENCE/diffraction/view/DiffractionScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const diffractionScreenIcon = require( 'image!WAVE_INTERFERENCE/diffraction_screen_icon.png' );

  // strings
  const screenDiffractionString = require( 'string!WAVE_INTERFERENCE/screen.diffraction' );

  /**
   * @constructor
   */
  function DiffractionScreen() {

    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenDiffractionString,
      homeScreenIcon: new Image( diffractionScreenIcon )
    };

    Screen.call( this,
      function() { return new DiffractionModel(); },
      function( model ) { return new DiffractionScreenView( model ); },
      options
    );
  }

  waveInterference.register( 'DiffractionScreen', DiffractionScreen );

  return inherit( Screen, DiffractionScreen );
} );
// Copyright 2017, University of Colorado Boulder

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var DiffractionModel = require( 'WAVE_INTERFERENCE/diffraction/model/DiffractionModel' );
  var DiffractionScreenView = require( 'WAVE_INTERFERENCE/diffraction/view/DiffractionScreenView' );

  /**
   * @constructor
   */
  function DiffractionScreen() {

    var options = {
      backgroundColorProperty: new Property( 'white' )
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
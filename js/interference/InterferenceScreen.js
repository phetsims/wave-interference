// Copyright 2017, University of Colorado Boulder

/**
 * "Interference" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InterferenceScreenModel = require( 'WAVE_INTERFERENCE/interference/model/InterferenceScreenModel' );
  const InterferenceScreenView = require( 'WAVE_INTERFERENCE/interference/view/InterferenceScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const interferenceScreenIcon = require( 'image!WAVE_INTERFERENCE/interference_screen_icon.png' );

  // strings
  const screenInterferenceString = require( 'string!WAVE_INTERFERENCE/screen.interference' );

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function InterferenceScreen( alignGroup ) {
    const options = {
      backgroundColorProperty: new Property( 'white' ),
      name: screenInterferenceString,
      homeScreenIcon: new Image( interferenceScreenIcon )
    };
    Screen.call( this,
      function() { return new InterferenceScreenModel(); },
      function( model ) { return new InterferenceScreenView( model, alignGroup ); },
      options
    );
  }

  waveInterference.register( 'InterferenceScreen', InterferenceScreen );

  return inherit( Screen, InterferenceScreen );
} );
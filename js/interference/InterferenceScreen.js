// Copyright 2017, University of Colorado Boulder

/**
 * "Interference" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InterferenceScreenModel = require( 'WAVE_INTERFERENCE/interference/model/InterferenceScreenModel' );
  var InterferenceScreenView = require( 'WAVE_INTERFERENCE/interference/view/InterferenceScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  var interferenceScreenIcon = require( 'image!WAVE_INTERFERENCE/interference_screen_icon.png' );

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function InterferenceScreen( alignGroup ) {
    var options = {
      backgroundColorProperty: new Property( 'white' ),
      name: 'Interference',
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
// Copyright 2017, University of Colorado Boulder

/**
 * "Interference" screen in the Wave Interference simulation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var InterferenceScreenModel = require( 'WAVE_INTERFERENCE/interference/model/InterferenceScreenModel' );
  var InterferenceScreenView = require( 'WAVE_INTERFERENCE/interference/view/InterferenceScreenView' );

  /**
   * @param {AlignGroup} alignGroup - for aligning the control panels on the right side of the lattice
   * @constructor
   */
  function InterferenceScreen( alignGroup ) {
    var homeScreenIcon = Rectangle.dimension( Screen.MINIMUM_HOME_SCREEN_ICON_SIZE, {
      fill: 'white'
    } );
    var options = {
      backgroundColorProperty: new Property( 'white' ),
      name: 'Interference',
      homeScreenIcon: homeScreenIcon
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
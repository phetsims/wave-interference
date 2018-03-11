// Copyright 2018, University of Colorado Boulder

/**
 * Slider abstraction for the frequency and amplitude sliders.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  /**
   * @param {string} title
   * @param {Property} property
   * @constructor
   */
  function TitledSlider( title, property ) {

    var titleNode = new WaveInterferenceText( title );
    var slider = new HSlider( property, {
      min: 0, max: 12
    }, {
      trackSize: new Dimension2( 150, 5 ),
      constrainValue: function( value ) {
        return 2 * Math.round( value / 2 );
      }
    } );
    slider.addMajorTick( 0, new WaveInterferenceText( '0' ) );
    slider.addMinorTick( 2 );
    slider.addMinorTick( 4 );
    slider.addMajorTick( 6 );
    slider.addMinorTick( 8 );
    slider.addMinorTick( 10 );
    slider.addMajorTick( 12, new WaveInterferenceText( 'max' ) );

    VBox.call( this, {
      spacing: 0,
      children: [
        titleNode,
        slider
      ]
    } );
  }

  waveInterference.register( 'TitledSlider', TitledSlider );

  return inherit( VBox, TitledSlider );
} );
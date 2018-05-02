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
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // constants
  var LABEL_OPTIONS = { fontSize: 10 };
  var MAX_TICK_INDEX = 10;
  var MAJOR_TICK_MODULUS = 5;

  /**
   * @param {Property} property
   * @param {number} min
   * @param {number} max
   * @constructor
   */
  function WaveInterferenceSlider( property, min, max, minLabelString ) {

    var minLabel = new WaveInterferenceText( minLabelString, LABEL_OPTIONS );
    var maxLabel = new WaveInterferenceText( 'max', LABEL_OPTIONS );
    var ticks = _.range( 0, MAX_TICK_INDEX + 1 ).map( function( index ) {
      return {
        value: Util.linear( 0, MAX_TICK_INDEX, min, max, index ),
        type: index % MAJOR_TICK_MODULUS === 0 ? 'major' : 'minor',
        label: index === 0 ? minLabel :
               index === MAX_TICK_INDEX ? maxLabel :
               null
      };
    } );

    HSlider.call( this, property, {
      min: min, max: max
    }, {
      thumbSize: WaveInterferenceConstants.THUMB_SIZE,
      trackSize: new Dimension2( 150, 5 ),

      // ticks
      tickLabelSpacing: 2,
      majorTickLength: 15,
      minorTickLength: 8,
      constrainValue: function( value ) {

        // find the closest tick
        return _.minBy( ticks, function( tick ) {return Math.abs( tick.value - value );} ).value;
      }
    } );

    for ( var i = 0; i < ticks.length; i++ ) {
      var tick = ticks[ i ];
      if ( tick.type === 'major' ) {
        this.addMajorTick( tick.value, tick.label ); // Label is optional
      }
      else {
        this.addMinorTick( tick.value, tick.label ); // Label is optional
      }
    }
  }

  waveInterference.register( 'WaveInterferenceSlider', WaveInterferenceSlider );

  return inherit( HSlider, WaveInterferenceSlider );
} );
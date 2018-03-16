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
   * @param {number} min
   * @param {number} max
   * @constructor
   */
  function TitledSlider( title, property, min, max ) {

    var titleNode = new WaveInterferenceText( title );

    var ticks = [
      {
        value: ( max - min ) * 0 / 12 + min,
        type: 'major',
        label: new WaveInterferenceText( '0', { fontSize: 10 } )
      },
      { value: ( max - min ) * 2 / 12 + min, type: 'minor' },
      { value: ( max - min ) * 4 / 12 + min, type: 'minor' },
      { value: ( max - min ) * 6 / 12 + min, type: 'major' },
      { value: ( max - min ) * 8 / 12 + min, type: 'minor' },
      { value: ( max - min ) * 10 / 12 + min, type: 'minor' },
      {
        value: ( max - min ) * 12 / 12 + min,
        type: 'major',
        label: new WaveInterferenceText( 'max', { fontSize: 10 } )
      } // TODO factor out ,{fontSize: 12}
    ];

    var slider = new HSlider( property, {
      min: min, max: max
    }, {
      thumbSize: new Dimension2( 22, 30 ), // TODO: match with other sliders in SlitsControlPanel
      trackSize: new Dimension2( 150, 5 ), // TODO: match with other sliders in SlitsControlPanel
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
        slider.addMajorTick( tick.value, tick.label ); // Label is optional
      }
      else {
        slider.addMinorTick( tick.value, tick.label ); // Label is optional
      }
    }
    VBox.call( this, {
      spacing: -5,
      children: [
        titleNode,
        slider
      ]
    } );
  }

  waveInterference.register( 'TitledSlider', TitledSlider );

  return inherit( VBox, TitledSlider );
} );
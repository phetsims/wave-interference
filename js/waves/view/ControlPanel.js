// Copyright 2018, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferencePanel' );
  var TitledSlider = require( 'WAVE_INTERFERENCE/waves/view/TitledSlider' );

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   * @constructor
   */
  function ControlPanel( model, alignGroup, options ) {

    options = _.extend( {
      yMargin: 10,
      xMargin: 10,
      fill: 'rgb(226,227,229)'
    }, options );

    var frequencySlider = new TitledSlider( 'Frequency', model.frequencyProperty );
    var amplitudeSlider = new TitledSlider( 'Amplitude', model.amplitudeProperty );
    var checkbox = new Checkbox( new WaveInterferenceText( 'Graph' ), model.showGraphProperty );
    var separator = new HSeparator( Math.max( checkbox.width, Math.max( frequencySlider.width, amplitudeSlider.width ) ) );

    var content = alignGroup.createBox( new VBox( {
      align: 'left',
      spacing: 14,
      children: [
        frequencySlider,
        amplitudeSlider,
        separator,
        checkbox
      ]
    } ) );

    WaveInterferencePanel.call( this, content, options );
  }

  waveInterference.register( 'ControlPanel', ControlPanel );

  return inherit( WaveInterferencePanel, ControlPanel );
} );
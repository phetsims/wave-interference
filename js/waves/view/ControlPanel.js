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
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/SceneTypeEnum' );
  var TitledSlider = require( 'WAVE_INTERFERENCE/waves/view/TitledSlider' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferencePanel' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/waves/view/WaveInterferenceText' );

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
      fill: 'rgb(230,231,232)'
    }, options );

    var frequencySlider = new TitledSlider( 'Frequency', model.frequencyProperty );
    var amplitudeSlider = new TitledSlider( 'Amplitude', model.amplitudeProperty );
    var checkbox = new Checkbox( new WaveInterferenceText( 'Graph' ), model.showGraphProperty );
    var separator = new HSeparator( Math.max( checkbox.width, Math.max( frequencySlider.width, amplitudeSlider.width ) ) );

    var sceneRadioButtons = new RadioButtonGroup( model.sceneProperty, [ {
      value: SceneTypeEnum.WATER,
      node: new WaveInterferenceText( 'water' )
    }, {
      value: SceneTypeEnum.SOUND,
      node: new WaveInterferenceText( 'sound' )
    }, {
      value: SceneTypeEnum.LIGHT,
      node: new WaveInterferenceText( 'light' )
    } ], {
      orientation: 'horizontal'
    } );

    var content = alignGroup.createBox( new VBox( {
      align: 'left',
      spacing: 14,
      children: [
        frequencySlider,
        amplitudeSlider,
        sceneRadioButtons,
        separator,
        checkbox
      ]
    } ) );

    WaveInterferencePanel.call( this, content, options );
  }

  waveInterference.register( 'ControlPanel', ControlPanel );

  return inherit( WaveInterferencePanel, ControlPanel );
} );
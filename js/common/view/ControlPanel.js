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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/common/model/SceneTypeEnum' );
  var WaveInterferenceSlider = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSlider' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   * @constructor
   */
  function ControlPanel( model, alignGroup, options ) {

    var frequencySlider = new WaveInterferenceSlider( model.frequencyProperty, 1, 19 );
    var wavelengthProperty = new Property( 400 );

    var lightFrequencySlider = new WavelengthSlider( wavelengthProperty, {
      trackWidth: 150,
      valueVisible: false,
      tweakersVisible: false,
      thumbWidth: 20,
      thumbHeight: 20
    } );

    var soundAndWaterFrequencySlider = new WaveInterferenceSlider( model.frequencyProperty, 1, 19 );
    soundAndWaterFrequencySlider.center = lightFrequencySlider.center;
    var frequencySliderContainer = new Node( { children: [ lightFrequencySlider, soundAndWaterFrequencySlider ] } );
    model.sceneProperty.link( function( scene ) {
      lightFrequencySlider.visible = scene === SceneTypeEnum.LIGHT;
      soundAndWaterFrequencySlider.visible = scene === SceneTypeEnum.SOUND || scene === SceneTypeEnum.WATER;
    } );
    var amplitudeSlider = new WaveInterferenceSlider( model.amplitudeProperty, 0, 14 ); // TODO: only used for one slider?
    var graphCheckbox = new Checkbox( new WaveInterferenceText( 'Graph' ), model.showGraphProperty, {
      boxWidth: 17
    } );
    var screenCheckbox = new Checkbox( new WaveInterferenceText( 'Screen' ), model.showScreenProperty, {
      boxWidth: 17
    } );
    var intensityCheckbox = new Checkbox( new WaveInterferenceText( 'Intensity' ), model.showIntensityGraphProperty, {
      boxWidth: 17 // TODO: factor out
    } );
    var separator = new HSeparator( Math.max( graphCheckbox.width, Math.max( frequencySlider.width, amplitudeSlider.width ) ) );

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
      spacing: 4,
      children: [
        new WaveInterferenceText( 'Frequency' ),
        frequencySliderContainer,
        new WaveInterferenceText( 'Amplitude' ),
        amplitudeSlider,
        sceneRadioButtons,
        separator,
        graphCheckbox,
        screenCheckbox,
        new HBox( { spacing: 0, children: [ new HStrut( 20 ), intensityCheckbox ] } )
      ]
    } ) );

    WaveInterferencePanel.call( this, content, options );
  }

  waveInterference.register( 'ControlPanel', ControlPanel );

  return inherit( WaveInterferencePanel, ControlPanel );
} );
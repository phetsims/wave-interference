// Copyright 2018, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 * TODO: rename to "MainControlPanel" or "WavesControlPanel"
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Checkbox = require( 'SUN/Checkbox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var SceneTypeEnum = require( 'WAVE_INTERFERENCE/common/model/SceneTypeEnum' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  var WaveInterferenceSlider = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSlider' );
  var WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  // constants
  var CHECKBOX_OPTIONS = {
    boxWidth: 17
  };

  /**
   * @param {WavesScreenModel} model
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   * @constructor
   */
  function ControlPanel( model, alignGroup, options ) {

    options = _.extend( {
      additionalControl: null
    }, options );

    var frequencySlider = new WaveInterferenceSlider( model.frequencyProperty, 1, 19 );
    var wavelengthProperty = new Property( 400 );

    var lightFrequencySlider = new WavelengthSlider( wavelengthProperty, {
      trackWidth: 150,
      trackHeight: 20,
      valueVisible: false,
      tweakersVisible: false,
      thumbWidth: 20,
      thumbHeight: 20
    } );

    // Controls are in the coordinate frame of the lattice
    var soundAndWaterFrequencySlider = new WaveInterferenceSlider( model.frequencyProperty, 1, 19 );
    lightFrequencySlider.centerTop = soundAndWaterFrequencySlider.centerTop.plusXY( 0, 10 );
    var frequencySliderContainer = new Node( { children: [ lightFrequencySlider, soundAndWaterFrequencySlider ] } );
    var amplitudeSlider = new WaveInterferenceSlider( model.amplitudeProperty, 0, 14 );

    var graphCheckbox = new Checkbox( new WaveInterferenceText( 'Graph' ), model.showGraphProperty, CHECKBOX_OPTIONS );
    var screenCheckbox = new Checkbox( new WaveInterferenceText( 'Screen' ), model.showScreenProperty, CHECKBOX_OPTIONS );
    var intensityCheckbox = new Checkbox( new WaveInterferenceText( 'Intensity' ), model.showIntensityGraphProperty, CHECKBOX_OPTIONS );
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

    var frequencyTitle = new WaveInterferenceText( 'Frequency' );
    var amplitudeTitle = new WaveInterferenceText( 'Amplitude' );

    // Horizontal layout
    var centerX = frequencyTitle.centerX;
    frequencySliderContainer.centerX = centerX;
    amplitudeTitle.centerX = centerX;
    amplitudeSlider.centerX = centerX;
    if ( options.additionalControl ) {options.additionalControl.centerX = centerX;}
    sceneRadioButtons.centerX = centerX;
    separator.centerX = centerX;
    var minX = _.min( [ frequencySliderContainer.left, amplitudeSlider.left, frequencyTitle.left, amplitudeTitle.left, sceneRadioButtons.left ] );
    minX = minX + 11; // Account for half the slider knob width, so it lines up with the slider left tick
    graphCheckbox.left = minX;
    screenCheckbox.left = minX;
    intensityCheckbox.left = minX + 20;

    // Vertical layout
    frequencySliderContainer.top = frequencyTitle.bottom - 5;
    amplitudeTitle.top = frequencySliderContainer.bottom + 2;
    amplitudeSlider.top = amplitudeTitle.bottom - 5;
    if ( options.additionalControl ) {
      options.additionalControl.top = amplitudeSlider.bottom + 5;
      sceneRadioButtons.top = options.additionalControl.bottom + 5;
    }
    else {
      sceneRadioButtons.top = amplitudeSlider.bottom + 5;
    }

    separator.top = sceneRadioButtons.bottom + 7;
    graphCheckbox.top = separator.bottom + 7;
    screenCheckbox.top = graphCheckbox.bottom + 5;
    intensityCheckbox.top = screenCheckbox.bottom + 5;

    model.sceneProperty.link( function( scene ) {
      lightFrequencySlider.visible = scene === SceneTypeEnum.LIGHT;
      soundAndWaterFrequencySlider.visible = scene === SceneTypeEnum.SOUND || scene === SceneTypeEnum.WATER;
    } );

    // z-ordering
    var content = alignGroup.createBox( new Node( {
      children: [
        frequencyTitle,
        frequencySliderContainer,
        amplitudeTitle,
        options.additionalControl || new Node(), // TODO: is it odd to have blank node here?
        amplitudeSlider,
        sceneRadioButtons,
        separator,
        graphCheckbox,
        screenCheckbox,
        intensityCheckbox
      ]
    } ) );

    WaveInterferencePanel.call( this, content, options );
  }

  waveInterference.register( 'ControlPanel', ControlPanel );

  return inherit( WaveInterferencePanel, ControlPanel );
} );
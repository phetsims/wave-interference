// Copyright 2018, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Checkbox = require( 'SUN/Checkbox' );
  const FrequencySlider = require( 'SCENERY_PHET/FrequencySlider' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const LightEmitterNode = require( 'WAVE_INTERFERENCE/common/view/LightEmitterNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceSlider = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSlider' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const amplitudeString = require( 'string!WAVE_INTERFERENCE/amplitude' );
  const frequencyString = require( 'string!WAVE_INTERFERENCE/frequency' );
  const graphString = require( 'string!WAVE_INTERFERENCE/graph' );
  const intensityString = require( 'string!WAVE_INTERFERENCE/intensity' );
  const screenString = require( 'string!WAVE_INTERFERENCE/screen' );

  // images
  const hoseImage = require( 'image!WAVE_INTERFERENCE/hose.png' );
  const speakerImage = require( 'image!WAVE_INTERFERENCE/speaker.png' );

  // constants
  const CHECKBOX_OPTIONS = {
    boxWidth: 12
  };

  class WaveInterferenceControlPanel extends WaveInterferencePanel {

    /**
     * @param {WavesScreenModel} model
     * @param {AlignGroup} alignGroup
     * @param {Object} [options]
     */
    constructor( model, alignGroup, options ) {

      options = _.extend( {

        // This additional control (if present) will be shown beneath the Amplitude slider in the WaveInterferenceControlPanel
        additionalControl: null,

        showIntensityCheckbox: true
      }, options );

      // Controls are in the metric coordinate frame
      const waterFrequencySlider = new WaveInterferenceSlider( model.waterScene.frequencyProperty, model.waterScene.minimumFrequency, model.waterScene.maximumFrequency );
      const soundFrequencySlider = new WaveInterferenceSlider( model.soundScene.frequencyProperty, model.soundScene.minimumFrequency, model.soundScene.maximumFrequency );

      // Create a Property in Hz as required by the FrequencySlider.
      // TODO: should this be in the model?
      const frequencyInHzProperty = new Property( model.lightScene.frequencyProperty.get() * 1E15 );
      model.lightScene.frequencyProperty.link( frequency => frequencyInHzProperty.set( frequency * 1E15 ) );
      frequencyInHzProperty.link( frequencyHz => model.lightScene.frequencyProperty.set( frequencyHz * 1E-15 ) );

      const lightFrequencySlider = new FrequencySlider( frequencyInHzProperty, {
        minFrequency: model.lightScene.minimumFrequency * 1E15,
        maxFrequency: model.lightScene.maximumFrequency * 1E15,
        trackWidth: 150,
        trackHeight: 20,
        valueVisible: false,
        tweakersVisible: false,
        thumbWidth: 20,
        thumbHeight: 20
      } );

      lightFrequencySlider.centerTop = soundFrequencySlider.centerTop.plusXY( 0, 10 );
      const frequencySliderContainer = new Node( { children: [ waterFrequencySlider, soundFrequencySlider, lightFrequencySlider ] } );
      const amplitudeSlider = new WaveInterferenceSlider( model.amplitudeProperty, model.amplitudeProperty.range.min, model.amplitudeProperty.range.max );

      const graphCheckbox = new Checkbox( new WaveInterferenceText( graphString ), model.showGraphProperty, CHECKBOX_OPTIONS );
      const screenCheckbox = new Checkbox( new WaveInterferenceText( screenString ), model.showScreenProperty, CHECKBOX_OPTIONS );
      const intensityCheckbox = new Checkbox( new WaveInterferenceText( intensityString ), model.showIntensityGraphProperty, CHECKBOX_OPTIONS );
      const maxComponentWidth = _.max( [ screenCheckbox.width, graphCheckbox.width, frequencySliderContainer.width, amplitudeSlider.width, lightFrequencySlider.width ] );
      const separator = new HSeparator( maxComponentWidth );

      const hoseIcon = new Image( hoseImage );
      const speakerIcon = new Image( speakerImage );
      const laserPointerIcon = new LaserPointerNode( new BooleanProperty( false ), LightEmitterNode.DEFAULT_OPTIONS );
      const iconWidth = 44;
      const iconHeight = iconWidth;
      hoseIcon.scale( iconWidth / hoseIcon.width );
      speakerIcon.scale( iconHeight / speakerIcon.height );
      laserPointerIcon.scale( iconWidth / laserPointerIcon.width );
      const sceneRadioButtons = new RadioButtonGroup( model.sceneProperty, [ {
        value: model.waterScene,
        node: hoseIcon
      }, {
        value: model.soundScene,
        node: speakerIcon
      }, {
        value: model.lightScene,
        node: laserPointerIcon
      } ], {
        orientation: 'horizontal'
      } );

      const frequencyTitle = new WaveInterferenceText( frequencyString );
      const amplitudeTitle = new WaveInterferenceText( amplitudeString );

      // Horizontal layout
      const centerX = frequencyTitle.centerX;
      frequencySliderContainer.centerX = centerX;
      amplitudeTitle.centerX = centerX;
      amplitudeSlider.centerX = centerX;
      if ( options.additionalControl ) {options.additionalControl.centerX = centerX;}
      sceneRadioButtons.centerX = centerX;
      separator.centerX = centerX;
      let minX = _.min( [ frequencySliderContainer.left, amplitudeSlider.left, frequencyTitle.left, amplitudeTitle.left, sceneRadioButtons.left ] );
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

      model.sceneProperty.link( scene => {
        waterFrequencySlider.visible = scene === model.waterScene;
        soundFrequencySlider.visible = scene === model.soundScene;
        lightFrequencySlider.visible = scene === model.lightScene;

        // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
        screenCheckbox.enabled = scene === model.lightScene;
        intensityCheckbox.enabled = scene === model.lightScene;
      } );

      // z-ordering
      const children = [
        frequencyTitle,
        frequencySliderContainer,
        amplitudeTitle,
        options.additionalControl || new Node(), // This is ugly but preferable to using concat calls
        amplitudeSlider,
        sceneRadioButtons,
        separator,
        graphCheckbox,
        screenCheckbox
      ];

      if ( options.showIntensityCheckbox ) {
        children.push( intensityCheckbox );
      }
      const content = alignGroup.createBox( new Node( {
        children: children
      } ) );

      super( content, options );
    }
  }

  return waveInterference.register( 'WaveInterferenceControlPanel', WaveInterferenceControlPanel );
} );
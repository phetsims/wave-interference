// Copyright 2018, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const FrequencySlider = require( 'SCENERY_PHET/FrequencySlider' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const SceneRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/SceneRadioButtonGroup' );
  const SoundViewType = require( 'WAVE_INTERFERENCE/common/model/SoundViewType' );
  const Util = require( 'DOT/Util' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceSlider = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceSlider' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  // strings
  const amplitudeString = require( 'string!WAVE_INTERFERENCE/amplitude' );
  const bothString = require( 'string!WAVE_INTERFERENCE/both' );
  const frequencyString = require( 'string!WAVE_INTERFERENCE/frequency' );
  const graphString = require( 'string!WAVE_INTERFERENCE/graph' );
  const intensityString = require( 'string!WAVE_INTERFERENCE/intensity' );
  const particlesString = require( 'string!WAVE_INTERFERENCE/particles' );
  const screenString = require( 'string!WAVE_INTERFERENCE/screen' );
  const wavesString = require( 'string!WAVE_INTERFERENCE/waves' );

  // constants
  const CHECKBOX_OPTIONS = { boxWidth: 14 };
  const fromFemto = WaveInterferenceUtils.fromFemto;

  class WaveInterferenceControlPanel extends WaveInterferencePanel {

    /**
     * @param {WavesModel} model
     * @param {AlignGroup} alignGroup
     * @param {Object} [options]
     */
    constructor( model, alignGroup, options ) {

      options = _.extend( {

        // {Node|null} This additional control (if present) will be shown beneath the Amplitude slider in the
        // WaveInterferenceControlPanel
        additionalControl: null,

        showIntensityCheckbox: true,
        maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH
      }, options );

      // Controls are in the physical coordinate frame
      const waterFrequencySlider = new WaveInterferenceSlider(
        model.getWaterFrequencySliderProperty(),
        model.waterScene.frequencyProperty.range.min,
        model.waterScene.frequencyProperty.range.max
      );
      const soundFrequencySlider = new WaveInterferenceSlider(
        model.soundScene.frequencyProperty,
        model.soundScene.frequencyProperty.range.min,
        model.soundScene.frequencyProperty.range.max
      );

      // For the light scene, create a Property in Hz as required by the FrequencySlider.
      const frequencyInHzProperty = new DynamicProperty( new Property( model.lightScene.frequencyProperty ), {
        bidirectional: true,
        map: frequency => WaveInterferenceUtils.fromFemto( frequency ),
        inverseMap: frequency => WaveInterferenceUtils.toFemto( frequency )
      } );

      const lightFrequencySlider = new FrequencySlider( frequencyInHzProperty, {
        minFrequency: fromFemto( model.lightScene.frequencyProperty.range.min ),
        maxFrequency: fromFemto( model.lightScene.frequencyProperty.range.max ),
        trackWidth: 150,
        trackHeight: 20,
        valueVisible: false,
        tweakersVisible: false,
        thumbWidth: 14,
        thumbHeight: 18
      } );

      lightFrequencySlider.centerTop = soundFrequencySlider.centerTop.plusXY( 0, 10 );
      const frequencySliderContainer = new Node( {
        children: [
          waterFrequencySlider,
          soundFrequencySlider,
          lightFrequencySlider
        ]
      } );

      const amplitudeSliderContainer = new SceneToggleNode( model, scene => {

        // For water scene, control the desiredAmplitude (which determines the size of the water drops)
        // For other scenes, control the amplitude directly.
        return new WaveInterferenceSlider(
          scene.desiredAmplitudeProperty || scene.amplitudeProperty,
          scene.amplitudeProperty.range.min,
          scene.amplitudeProperty.range.max
        );
      } );

      const soundViewTypeRadioButtonGroup = new VerticalAquaRadioButtonGroup( [ {
        node: new WaveInterferenceText( wavesString ),
        value: SoundViewType.WAVES,
        property: model.soundScene.viewSelectionProperty
      }, {
        node: new WaveInterferenceText( particlesString ),
        value: SoundViewType.PARTICLES,
        property: model.soundScene.viewSelectionProperty
      }, {
        node: new WaveInterferenceText( bothString ),
        value: SoundViewType.BOTH,
        property: model.soundScene.viewSelectionProperty
      } ], {
        spacing: 4,
        radioButtonOptions: {

          // Manually tuned so the radio buttons have the same width as the "Graph" checkbox
          radius: 6.5
        }
      } );

      const graphCheckbox = new Checkbox(
        new WaveInterferenceText( graphString ),
        model.showGraphProperty,
        CHECKBOX_OPTIONS
      );
      const screenCheckbox = new Checkbox(
        new WaveInterferenceText( screenString ),
        model.showScreenProperty,
        CHECKBOX_OPTIONS
      );
      const intensityCheckbox = new Checkbox(
        new WaveInterferenceText( intensityString ),
        model.showIntensityGraphProperty,
        CHECKBOX_OPTIONS
      );

      // Only enable the intensity checkbox when the screen is selected
      model.showScreenProperty.link( showScreen => intensityCheckbox.setEnabled( showScreen ) );

      const maxComponentWidth = _.max( [
        soundViewTypeRadioButtonGroup.width,
        screenCheckbox.width,
        graphCheckbox.width,
        frequencySliderContainer.width,
        amplitudeSliderContainer.width,
        lightFrequencySlider.width
      ] );
      const separator = new HSeparator( maxComponentWidth );

      // Set pointer areas for the checkboxes, now that we have the separator dimensions.
      graphCheckbox.mouseArea = graphCheckbox.localBounds.dilated( 2 ).withX( separator.right );
      graphCheckbox.touchArea = graphCheckbox.mouseArea;

      screenCheckbox.mouseArea = screenCheckbox.localBounds.dilated( 2 ).withX( separator.right );
      screenCheckbox.touchArea = screenCheckbox.mouseArea;

      intensityCheckbox.mouseArea = intensityCheckbox.localBounds.dilated( 2 ).withX( separator.right );
      intensityCheckbox.touchArea = intensityCheckbox.mouseArea;

      //REVIEW worthy of factoring out into its own class file, SceneRadioButtonGroup?
      //REVIEW* I added SceneRadioButtonGroup.js, please review
      const sceneRadioButtonGroup = new SceneRadioButtonGroup(
        model.waterScene,
        model.soundScene,
        model.lightScene,
        model.sceneProperty
      );

      const frequencyTitle = new WaveInterferenceText( frequencyString );
      const amplitudeTitle = new WaveInterferenceText( amplitudeString );

      // Horizontal layout
      const centerX = frequencyTitle.centerX;
      frequencySliderContainer.centerX = centerX;
      amplitudeTitle.centerX = centerX;
      amplitudeSliderContainer.centerX = centerX;
      if ( options.additionalControl ) {options.additionalControl.centerX = centerX;}
      sceneRadioButtonGroup.centerX = centerX;
      separator.centerX = centerX;
      const minX = _.min( [
        frequencySliderContainer.left,
        amplitudeSliderContainer.left,
        frequencyTitle.left,
        amplitudeTitle.left,
        sceneRadioButtonGroup.left
      ] );

      // Align controls to the left
      soundViewTypeRadioButtonGroup.left = minX;
      graphCheckbox.left = minX;
      screenCheckbox.left = minX;

      // Indent the intensity checkbox
      intensityCheckbox.left = minX + 20;

      // Vertical layout
      const TALL_TEXT_SPACING = -2;
      const SHORT_TEXT_SPACING = 5;

      // At the default size, the text should "nestle" into the slider.  But when the text is too small,
      // it must be spaced further away.  See https://github.com/phetsims/wave-interference/issues/194
      const frequencyTitleSpacing = Util.linear( 17, 4, TALL_TEXT_SPACING, SHORT_TEXT_SPACING, frequencyTitle.height );
      frequencySliderContainer.top = frequencyTitle.bottom + frequencyTitleSpacing;
      amplitudeTitle.top = frequencySliderContainer.bottom + 7;

      // At the default size, the text should "nestle" into the slider.  But when the text is too small,
      // it must be spaced further away.  See https://github.com/phetsims/wave-interference/issues/194
      const amplitudeTitleSpacing = Util.linear( 17, 4, TALL_TEXT_SPACING, SHORT_TEXT_SPACING, amplitudeTitle.height );
      amplitudeSliderContainer.top = amplitudeTitle.bottom + amplitudeTitleSpacing;

      const y = amplitudeSliderContainer.bottom + 5;

      // The Separation NumberControl is an additionalControl
      if ( options.additionalControl ) {
        options.additionalControl.top = y + 8;
        sceneRadioButtonGroup.top = options.additionalControl.bottom + 8 + 8;
      }
      else {
        sceneRadioButtonGroup.top = y + 8;
      }
      const HORIZONTAL_SEPARATOR_MARGIN = 7;
      const CHECKBOX_SPACING = 6;
      separator.top = sceneRadioButtonGroup.bottom + 12;
      graphCheckbox.top = separator.bottom + HORIZONTAL_SEPARATOR_MARGIN;
      soundViewTypeRadioButtonGroup.top = graphCheckbox.bottom + CHECKBOX_SPACING + 2;
      screenCheckbox.top = graphCheckbox.bottom + CHECKBOX_SPACING;
      intensityCheckbox.top = screenCheckbox.bottom + CHECKBOX_SPACING;

      const container = new Node();

      // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
      model.sceneProperty.link( scene => {
        waterFrequencySlider.visible = scene === model.waterScene;
        soundFrequencySlider.visible = scene === model.soundScene;
        lightFrequencySlider.visible = scene === model.lightScene;

        // z-ordering
        container.children = [

          frequencyTitle,
          frequencySliderContainer,

          amplitudeTitle,
          amplitudeSliderContainer,

          ...( options.additionalControl ? [ options.additionalControl ] : [] ),
          sceneRadioButtonGroup,
          separator,
          graphCheckbox,

          // Wave/Particle selection only for Sound scene
          ...( scene === model.soundScene && model.soundScene.showSoundParticles ? [ soundViewTypeRadioButtonGroup ] : [] ),

          // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
          ...( scene === model.lightScene ? [ screenCheckbox ] : [] ),
          ...( scene === model.lightScene && options.showIntensityCheckbox ? [ intensityCheckbox ] : [] )
        ];
      } );

      const content = alignGroup.createBox( container );

      super( content, options );
    }
  }

  return waveInterference.register( 'WaveInterferenceControlPanel', WaveInterferenceControlPanel );
} );
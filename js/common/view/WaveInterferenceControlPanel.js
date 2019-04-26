// Copyright 2018-2019, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AmplitudeControl = require( 'WAVE_INTERFERENCE/common/view/AmplitudeControl' );
  const FrequencyControl = require( 'WAVE_INTERFERENCE/common/view/FrequencyControl' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SceneRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/SceneRadioButtonGroup' );
  const SoundViewTypeRadioButtonGroup = require( 'WAVE_INTERFERENCE/common/view/SoundViewTypeRadioButtonGroup' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceCheckbox = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceCheckbox' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );

  // strings
  const graphString = require( 'string!WAVE_INTERFERENCE/graph' );
  const intensityString = require( 'string!WAVE_INTERFERENCE/intensity' );
  const playSoundString = require( 'string!WAVE_INTERFERENCE/playSound' );
  const screenString = require( 'string!WAVE_INTERFERENCE/screen' );

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
        maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
        yMargin: 4,
        showSceneRadioButtons: true,
        showPlaySoundButton: false,
        supportsSound: true
      }, options );

      const frequencyControl = new FrequencyControl( model );
      const amplitudeControl = new AmplitudeControl( model );
      const soundViewTypeRadioButtonGroup = new SoundViewTypeRadioButtonGroup( model );

      const graphCheckbox = new WaveInterferenceCheckbox(
        new WaveInterferenceText( graphString ),
        model.showGraphProperty, {
          audioEnabled: options.supportsSound
        } );
      const screenCheckbox = new WaveInterferenceCheckbox(
        new WaveInterferenceText( screenString ),
        model.showScreenProperty, {
          audioEnabled: options.supportsSound
        } );
      const intensityCheckbox = new WaveInterferenceCheckbox(
        new WaveInterferenceText( intensityString ),
        model.showIntensityGraphProperty, {
          audioEnabled: options.supportsSound
        } );

      // Only enable the intensity checkbox when the screen is selected
      model.showScreenProperty.link( showScreen => intensityCheckbox.setEnabled( showScreen ) );

      const maxComponentWidth = _.max( [
        soundViewTypeRadioButtonGroup.width,
        screenCheckbox.width,
        graphCheckbox.width,
        frequencyControl.width,
        amplitudeControl.width
      ] );
      const separator = new HSeparator( maxComponentWidth );

      // Set pointer areas for the checkboxes, now that we have the separator dimensions.
      graphCheckbox.mouseArea = graphCheckbox.localBounds.dilated( 2 ).withX( separator.right );
      graphCheckbox.touchArea = graphCheckbox.mouseArea;

      screenCheckbox.mouseArea = screenCheckbox.localBounds.dilated( 2 ).withX( separator.right );
      screenCheckbox.touchArea = screenCheckbox.mouseArea;

      intensityCheckbox.mouseArea = intensityCheckbox.localBounds.dilated( 2 ).withX( separator.right );
      intensityCheckbox.touchArea = intensityCheckbox.mouseArea;

      const sceneRadioButtonGroup = options.showSceneRadioButtons ? new SceneRadioButtonGroup(
        model.waterScene,
        model.soundScene,
        model.lightScene,
        model.sceneProperty
      ) : null;

      const playSoundCheckbox = new WaveInterferenceCheckbox( new WaveInterferenceText( playSoundString ),
        model.soundScene.isSoundPlayingProperty, {
          audioEnabled: options.supportsSound
        } );

      // Horizontal layout
      const centerX = frequencyControl.centerX;
      frequencyControl.centerX = centerX;
      amplitudeControl.centerX = centerX;
      if ( options.additionalControl ) {options.additionalControl.centerX = centerX;}
      if ( sceneRadioButtonGroup ) { sceneRadioButtonGroup.centerX = centerX; }
      separator.centerX = centerX;
      const minX = _.min( [
        frequencyControl.left,
        amplitudeControl.left,
        ...( sceneRadioButtonGroup ? [ sceneRadioButtonGroup.left ] : [] )
      ] );

      // Align controls to the left
      soundViewTypeRadioButtonGroup.left = minX;
      graphCheckbox.left = minX;
      screenCheckbox.left = minX;
      playSoundCheckbox.left = minX;

      // Indent the intensity checkbox
      intensityCheckbox.left = minX + 20;

      // Vertical layout
      amplitudeControl.top = frequencyControl.bottom + 7;
      const y = amplitudeControl.bottom + 5;

      // The Separation NumberControl is an additionalControl
      if ( options.additionalControl ) {
        options.additionalControl.top = y + 8;
        if ( sceneRadioButtonGroup ) {
          sceneRadioButtonGroup.top = options.additionalControl.bottom + 8 + 8;
        }
      }
      else {
        if ( sceneRadioButtonGroup ) {
          sceneRadioButtonGroup.top = y + 8;
        }
      }
      const HORIZONTAL_SEPARATOR_MARGIN = 7;
      const CHECKBOX_SPACING = 6;
      separator.top = sceneRadioButtonGroup ? ( sceneRadioButtonGroup.bottom + 8 ) : y;
      graphCheckbox.top = separator.bottom + HORIZONTAL_SEPARATOR_MARGIN;
      playSoundCheckbox.top = graphCheckbox.bottom + CHECKBOX_SPACING;
      soundViewTypeRadioButtonGroup.top = ( options.showPlaySoundButton ? playSoundCheckbox.bottom : graphCheckbox.bottom ) + CHECKBOX_SPACING + 2;
      screenCheckbox.top = graphCheckbox.bottom + CHECKBOX_SPACING;
      intensityCheckbox.top = screenCheckbox.bottom + CHECKBOX_SPACING;

      const container = new Node();

      // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
      model.sceneProperty.link( scene => {

        // z-ordering
        container.children = [

          frequencyControl,
          amplitudeControl,

          ...( options.additionalControl ? [ options.additionalControl ] : [] ),
          ...( sceneRadioButtonGroup ? [ sceneRadioButtonGroup ] : [] ),
          separator,
          graphCheckbox,

          // Wave/Particle selection only for Sound scene
          ...( scene === model.soundScene && model.soundScene.showSoundParticles ? [ soundViewTypeRadioButtonGroup ] : [] ),

          // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
          ...( scene === model.lightScene ? [ screenCheckbox ] : [] ),
          ...( scene === model.lightScene && options.showIntensityCheckbox ? [ intensityCheckbox ] : [] ),

          ...( scene === model.soundScene && options.showPlaySoundButton ? [ playSoundCheckbox ] : [] )
        ];
      } );

      const content = alignGroup.createBox( container );

      super( content, options );
    }
  }

  return waveInterference.register( 'WaveInterferenceControlPanel', WaveInterferenceControlPanel );
} );
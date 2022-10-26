// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node, Line } from '../../../../scenery/js/imports.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceStrings from '../../WaveInterferenceStrings.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import AmplitudeControl from './AmplitudeControl.js';
import FrequencyControl from './FrequencyControl.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';
import SoundViewTypeRadioButtonGroup from './SoundViewTypeRadioButtonGroup.js';
import WaveInterferenceCheckbox from './WaveInterferenceCheckbox.js';
import WaveInterferencePanel from './WaveInterferencePanel.js';
import WaveInterferenceText from './WaveInterferenceText.js';

const graphString = WaveInterferenceStrings.graph;
const intensityString = WaveInterferenceStrings.intensity;
const playToneString = WaveInterferenceStrings.playTone;
const screenLabelString = WaveInterferenceStrings.screenLabel;
const soundEffectString = WaveInterferenceStrings.soundEffect;

class WaveInterferenceControlPanel extends WaveInterferencePanel {

  public constructor( model, alignGroup, options ) {

    options = merge( {

      // {Node|null} This additional control (if present) will be shown beneath the Amplitude slider in the
      // WaveInterferenceControlPanel
      additionalControl: null,

      showIntensityCheckbox: true,
      maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
      yMargin: 4,
      showSceneRadioButtons: true,
      showPlaySoundControl: false,
      audioEnabled: true
    }, options );

    const frequencyControl = new FrequencyControl( model );
    const amplitudeControl = new AmplitudeControl( model );

    let soundViewTypeRadioButtonGroup = null;
    if ( model.soundScene && model.soundScene.showSoundParticles ) {
      soundViewTypeRadioButtonGroup = new SoundViewTypeRadioButtonGroup( model );
    }

    const graphCheckbox = new WaveInterferenceCheckbox( model.showGraphProperty, new WaveInterferenceText( graphString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ) );
    const screenCheckbox = new WaveInterferenceCheckbox( model.showScreenProperty, new WaveInterferenceText( screenLabelString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ) );
    const intensityCheckbox = new WaveInterferenceCheckbox( model.showIntensityGraphProperty, new WaveInterferenceText( intensityString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ) );

    // Only enable the intensity checkbox when the screen is selected
    model.showScreenProperty.link( showScreen => intensityCheckbox.setEnabled( showScreen ) );

    const maxComponentWidth = _.max( [
      ...( soundViewTypeRadioButtonGroup ? [ soundViewTypeRadioButtonGroup.width ] : [] ),
      screenCheckbox.width,
      graphCheckbox.width,
      frequencyControl.width,
      amplitudeControl.width
    ] );
    const separator = new Line( 0, 0, maxComponentWidth, 0, {
      stroke: 'rgb( 100, 100, 100 )'
    } );

    // Set pointer areas for the checkboxes, now that we have the separator dimensions.
    const updatePointerAreas = checkbox => {
      checkbox.mouseArea = checkbox.localBounds.dilated( 2 ).withX( maxComponentWidth );
      checkbox.touchArea = checkbox.mouseArea;
    };

    updatePointerAreas( graphCheckbox );
    updatePointerAreas( screenCheckbox );
    updatePointerAreas( intensityCheckbox );

    // See also playToneCheckbox mouseArea/touchArea set below

    const sceneRadioButtonGroup = options.showSceneRadioButtons ? new SceneRadioButtonGroup(
      model.waterScene,
      model.soundScene,
      model.lightScene,
      model.sceneProperty
    ) : null;

    let playToneCheckbox = null;

    // Only show the Play Tone checkbox for the Sound Scene, if specified.
    if ( model.soundScene && options.showPlaySoundControl ) {
      playToneCheckbox = new WaveInterferenceCheckbox( model.soundScene.isTonePlayingProperty, new WaveInterferenceText( playToneString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ), {
        audioEnabled: options.audioEnabled
      } );

      // In terms of PhET-iO, there could be a situation where a client wants to control the enabledProperty of the
      // sound-related checkboxes, and toggling the mute button in the navbar will override their customization. There
      // is precedent for handling this sort of situation in other sims, such as the neutralIndicatorNode in ph-scale
      // (phetsims/ph-scale#102) and the phaseDiagramContainer in states-of-matter (phetsims/states-of-matter#332).
      soundManager.enabledProperty.link( enabled => {
        playToneCheckbox.enabled = enabled;
      } );

      updatePointerAreas( playToneCheckbox );
    }

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
    if ( soundViewTypeRadioButtonGroup ) {
      soundViewTypeRadioButtonGroup.left = minX;
    }
    graphCheckbox.left = minX;
    screenCheckbox.left = minX;
    if ( playToneCheckbox ) {
      playToneCheckbox.left = minX;
    }

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
    if ( playToneCheckbox ) {
      playToneCheckbox.top = graphCheckbox.bottom + CHECKBOX_SPACING;
    }
    if ( soundViewTypeRadioButtonGroup ) {
      soundViewTypeRadioButtonGroup.top = ( playToneCheckbox ? playToneCheckbox.bottom : graphCheckbox.bottom ) + CHECKBOX_SPACING + 2;
    }
    screenCheckbox.top = graphCheckbox.bottom + CHECKBOX_SPACING;
    intensityCheckbox.top = screenCheckbox.bottom + CHECKBOX_SPACING;

    const container = new Node();

    const createLightSonificationCheckbox = () => {

      const lastCheckbox = options.showIntensityCheckbox ? intensityCheckbox : screenCheckbox;
      const soundEffectCheckbox = new WaveInterferenceCheckbox( model.lightScene.soundEffectEnabledProperty, new WaveInterferenceText( soundEffectString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ), {
        audioEnabled: options.audioEnabled,
        top: lastCheckbox.bottom + CHECKBOX_SPACING,
        left: screenCheckbox.left
      } );

      // In terms of PhET-iO, there could be a situation where a client wants to control the enabledProperty of the
      // sound-related checkboxes, and toggling the mute button in the navbar will override their customization. There
      // is precedent for handling this sort of situation in other sims, such as the neutralIndicatorNode in ph-scale
      // (phetsims/ph-scale#102) and the phaseDiagramContainer in states-of-matter (phetsims/states-of-matter#332).
      soundManager.enabledProperty.link( enabled => {
        soundEffectCheckbox.enabled = enabled;
      } );
      updatePointerAreas( soundEffectCheckbox );

      return soundEffectCheckbox;
    };

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

        ...( scene === model.soundScene && playToneCheckbox ? [ playToneCheckbox ] : [] ),

        // Wave/Particle selection only for Sound scene
        ...( scene === model.soundScene && model.soundScene.showSoundParticles ? [ soundViewTypeRadioButtonGroup ] : [] ),

        // Screen & Intensity graph should only be available for light scenes. Remove it from water and sound.
        ...( scene === model.lightScene ? [ screenCheckbox ] : [] ),
        ...( scene === model.lightScene && options.showIntensityCheckbox ? [ intensityCheckbox ] : [] ),
        ...( scene === model.lightScene ? [ createLightSonificationCheckbox() ] : [] )
      ];
    } );

    const content = alignGroup.createBox( container );

    super( content, options );
  }
}

waveInterference.register( 'WaveInterferenceControlPanel', WaveInterferenceControlPanel );
export default WaveInterferenceControlPanel;
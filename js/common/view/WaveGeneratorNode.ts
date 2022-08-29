// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * For each scene, shows one node for each wave generator, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import RoundStickyToggleButton from '../../../../sun/js/buttons/RoundStickyToggleButton.js';
import waveInterference from '../../waveInterference.js';
import Scene from '../model/Scene.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import DisturbanceTypeIconNode from './DisturbanceTypeIconNode.js';

class WaveGeneratorNode extends Node {

  /**
   * @param scene
   * @param waveAreaNode - for bounds
   * @param buttonPosition - x offset
   * @param isPrimarySource
   * @param sourceNode - for the wave generators, shared with scenery DAG
   * @param [verticalOffset] - offset for the hose, so the water has some distance to fall
   * @param [buttonOffset] - offset for the button, so it can be positioned on the pipe
   * @param [showButtonBackground] - true if a new background for the button should be added
   */
  public constructor( scene, waveAreaNode, buttonPosition, isPrimarySource, sourceNode,
               verticalOffset = 0,
               buttonOffset = 0,
               showButtonBackground = false ) {
    const pulseIcon = new DisturbanceTypeIconNode( Scene.DisturbanceType.PULSE, {
      scale: 0.36,
      stroked: true
    } );

    const buttonPressedProperty = isPrimarySource ? scene.button1PressedProperty : scene.button2PressedProperty;

    // Adapter to play the waveGeneratorButtonSound for the scene.
    const soundPlayer = {
      play() {
        scene.waveGeneratorButtonSound( buttonPressedProperty.value );
      }
    };

    const buttonOptions = {
      centerY: sourceNode.centerY + buttonOffset,
      left: buttonPosition,
      radius: WaveInterferenceConstants.WAVE_GENERATOR_BUTTON_RADIUS,
      content: pulseIcon,
      touchAreaDilation: WaveInterferenceConstants.WAVE_GENERATOR_BUTTON_TOUCH_AREA_DILATION,
      baseColor: WaveInterferenceConstants.WAVE_GENERATOR_BUTTON_COLOR,
      soundPlayer: soundPlayer
    };

    const button = new RoundStickyToggleButton( buttonPressedProperty, false, true, buttonOptions );
    const children = [ sourceNode ];
    if ( showButtonBackground ) {
      const diameter = button.width * 1.3;
      children.push( new ShadedSphereNode( diameter, {
        center: button.center,
        mainColor: '#b1b1b1',
        highlightColor: 'white',
        shadowColor: 'black',
        highlightXOffset: -0.2,
        highlightYOffset: -0.5
      } ) );
    }
    children.push( button );
    const nodeWithButton = new Node( { children: children } );

    const updateEnabled = () => {
      if ( scene.disturbanceTypeProperty.value === Scene.DisturbanceType.PULSE ) {
        button.enabled = !scene.pulseFiringProperty.value && !scene.isAboutToFireProperty.value;
      }
      else if ( scene.disturbanceTypeProperty.value === Scene.DisturbanceType.CONTINUOUS ) {
        button.enabled = true;
      }
    };

    // When changing between PULSE and CONTINUOUS, update the buttons.
    scene.disturbanceTypeProperty.link( disturbanceType => {
        pulseIcon.visible = disturbanceType === Scene.DisturbanceType.PULSE;
        updateEnabled();
      }
    );
    scene.pulseFiringProperty.link( updateEnabled );
    scene.isAboutToFireProperty.link( updateEnabled );
    super( {
      children: [ nodeWithButton ]
    } );

    const sourceSeparationProperty = scene.desiredSourceSeparationProperty || scene.sourceSeparationProperty;
    sourceSeparationProperty.link( sourceSeparation => {

      // Distance between the sources, or 0 if there is only 1 source
      const separation = scene.numberOfSources === 2 ? sourceSeparation : 0;
      if ( !isPrimarySource ) {
        nodeWithButton.visible = separation > 0;
      }
      const sign = isPrimarySource ? 1 : -1;
      const viewSeparation = scene.modelViewTransform.modelToViewDeltaY( separation );

      nodeWithButton.centerY = waveAreaNode.centerY + sign * viewSeparation / 2 + verticalOffset;
    } );
  }
}

waveInterference.register( 'WaveGeneratorNode', WaveGeneratorNode );
export default WaveGeneratorNode;
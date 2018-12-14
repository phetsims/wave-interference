// Copyright 2018, University of Colorado Boulder

/**
 * For each scene, shows one node for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const InputTypeIconNode = require( 'WAVE_INTERFERENCE/common/view/InputTypeIconNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveTemporalType = require( 'WAVE_INTERFERENCE/common/model/WaveTemporalType' );

  class EmitterNode extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Scene} scene
     * @param {Node} waveAreaNode - for bounds
     * @param {number} buttonPosition - x offset
     * @param {boolean} isPrimarySource
     * @param {Node} sourceNode - for the emitters, shared with scenery DAG
     * @param {number} [verticalOffset] - offset for the hose, so the water has some distance to fall
     * @param {number} [buttonOffset] - offset for the button, so it can be positioned on the pipe
     * @param {boolean} [showButtonBackground] - true if a new background for the button should be added
     */
    constructor( model, scene, waveAreaNode, buttonPosition, isPrimarySource, sourceNode,
                 verticalOffset = 0,
                 buttonOffset = 0,
                 showButtonBackground = false ) {
      const pulseIcon = new InputTypeIconNode( WaveTemporalType.PULSE, { scale: 0.48 } );

      const buttonOptions = {
        centerY: sourceNode.centerY + buttonOffset,
        left: buttonPosition,
        radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS,
        content: pulseIcon
        // baseColor is set in the link function below
      };

      const button = new RoundStickyToggleButton(
        false,
        true,
        isPrimarySource ? scene.button1PressedProperty : scene.button2PressedProperty,
        buttonOptions
      );
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
        if ( scene.waveTemporalTypeProperty.value === WaveTemporalType.PULSE ) {
          button.enabled = !scene.pulseFiringProperty.value && !scene.isAboutToFireProperty.value;
        }
        else if ( scene.waveTemporalTypeProperty.value === WaveTemporalType.CONTINUOUS ) {
          button.enabled = true;
        }
      };

      // When changing between PULSE and CONTINUOUS, update the buttons.
      scene.waveTemporalTypeProperty.link( waveTemporalType => {
          button.setBaseColor( waveTemporalType === WaveTemporalType.CONTINUOUS ?
                               WaveInterferenceConstants.EMITTER_BUTTON_COLOR :
                               '#33dd33' );
          pulseIcon.visible = waveTemporalType === WaveTemporalType.PULSE;
          updateEnabled();
        }
      );
      scene.pulseFiringProperty.link( updateEnabled );
      scene.isAboutToFireProperty.link( updateEnabled );
      super( {
        children: [ nodeWithButton ]
      } );

      const modelViewTransform = ModelViewTransform2.createRectangleMapping(
        scene.getWaveAreaBounds(),
        waveAreaNode.bounds
      );

      const sourceSeparationProperty = scene.desiredSourceSeparationProperty || scene.sourceSeparationProperty;
      sourceSeparationProperty.link( sourceSeparation => {
        if ( !isPrimarySource ) {
          nodeWithButton.visible = sourceSeparation > 0;
        }
        const sign = isPrimarySource ? 1 : -1;
        const viewSeparation = modelViewTransform.modelToViewDeltaY( sourceSeparation );

        nodeWithButton.centerY = waveAreaNode.centerY + sign * viewSeparation / 2 + verticalOffset;
      } );
    }
  }

  return waveInterference.register( 'EmitterNode', EmitterNode );
} );
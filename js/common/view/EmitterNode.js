// Copyright 2018, University of Colorado Boulder

/**
 * For each scene, shows one node for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  class EmitterNode extends Node {

    /**
     * @param {WavesScreenModel} model
     * @param {Scene} scene
     * @param {Node} waveAreaNode - for bounds
     * @param {number} buttonPosition - x offset
     * @param {boolean} isPrimarySource
     * @param {Node} sourceNode - for the emitters, shared with scenery DAG
     * @param {number} verticalOffset - offset for the hose, so the water has some distance to fall
     */
    constructor( model, scene, waveAreaNode, buttonPosition, isPrimarySource, sourceNode, verticalOffset = 0 ) {
      const buttonOptions = {
        centerY: sourceNode.centerY,
        left: buttonPosition,
        baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
        radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
      };
      const button = new RoundStickyToggleButton( false, true, isPrimarySource ? model.button1PressedProperty : model.button2PressedProperty, buttonOptions );
      const nodeWithButton = new Node( { children: [ sourceNode, button ] } );

      const updateEnabled = () => {
        if ( model.inputTypeProperty.value === IncomingWaveType.PULSE ) {
          button.enabled = !model.pulseFiringProperty.value;
        }
        else if ( model.inputTypeProperty.value === IncomingWaveType.CONTINUOUS ) {
          button.enabled = true;
        }
      };
      model.inputTypeProperty.link( updateEnabled );
      model.pulseFiringProperty.link( updateEnabled );
      super( {
        children: [ nodeWithButton ]
      } );

      const modelViewTransform = ModelViewTransform2.createRectangleMapping( scene.getWaveAreaBounds(), waveAreaNode.bounds );

      scene.sourceSeparationProperty.link( sourceSeparation => {
        if ( !isPrimarySource ) {
          nodeWithButton.visible = sourceSeparation > 0;
        }
        const sign = isPrimarySource ? 1 : -1;
        const viewSeparation = modelViewTransform.modelToViewDeltaY( sourceSeparation );

        // TODO: translate the whole node, not just the nodeWithButton
        nodeWithButton.centerY = waveAreaNode.centerY + sign * viewSeparation / 2 + verticalOffset;
      } );
    }
  }

  return waveInterference.register( 'EmitterNode', EmitterNode );
} );
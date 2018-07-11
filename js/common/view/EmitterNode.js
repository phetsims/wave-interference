// Copyright 2018, University of Colorado Boulder

/**
 * For each scene, shows one node for each emitter, each with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  var WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );

  /**
   * @param {WavesScreenModel} model
   * @param {Scene} scene
   * @param {Node} waveAreaNode - for bounds
   * @param {number} buttonPosition - x offset
   * @param {Node} sourceNode - for the emitters, shared with scenery DAG
   * @constructor
   */
  function EmitterNode( model, scene, waveAreaNode, buttonPosition, sourceNode ) {
    var buttonOptions = {
      centerY: sourceNode.centerY,
      left: buttonPosition,
      baseColor: WaveInterferenceConstants.EMITTER_BUTTON_COLOR,
      radius: WaveInterferenceConstants.EMITTER_BUTTON_RADIUS
    };
    var button1 = new RoundStickyToggleButton( false, true, model.button1PressedProperty, buttonOptions );
    var nodeWithButton1 = new Node( { children: [ sourceNode, button1 ] } );

    var button2 = new RoundStickyToggleButton( false, true, model.button2PressedProperty, buttonOptions );
    var nodeWithButton2 = new Node( { children: [ sourceNode, button2 ] } );

    var updateEnabled = function() {
      if ( model.inputTypeProperty.value === IncomingWaveType.PULSE ) {
        button1.enabled = !model.pulseFiringProperty.value;
        button2.enabled = !model.pulseFiringProperty.value;
      }
      else if ( model.inputTypeProperty.value === IncomingWaveType.CONTINUOUS ) {
        button1.enabled = true;
        button2.enabled = true;
      }
    };
    model.inputTypeProperty.link( updateEnabled );
    model.pulseFiringProperty.link( updateEnabled );
    Node.call( this, {
      children: [ nodeWithButton1, nodeWithButton2 ]
    } );

    var modelViewTransform = ModelViewTransform2.createRectangleMapping( scene.getWaveAreaBounds(), waveAreaNode.bounds );

    scene.sourceSeparationProperty.link( function( sourceSeparation ) {
      nodeWithButton2.visible = sourceSeparation > 0;

      var viewSeparation = modelViewTransform.modelToViewDeltaY( sourceSeparation );
      nodeWithButton1.centerY = waveAreaNode.centerY + viewSeparation / 2;
      nodeWithButton2.centerY = waveAreaNode.centerY - viewSeparation / 2;
    } );
  }

  waveInterference.register( 'EmitterNode', EmitterNode );

  return inherit( Node, EmitterNode );
} );
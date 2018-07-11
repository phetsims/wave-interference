// Copyright 2018, University of Colorado Boulder

/**
 * For the lightScene, shows one laser pointer for each emitter, with its own on/off button.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var IncomingWaveType = require( 'WAVE_INTERFERENCE/common/model/IncomingWaveType' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // image
  var speakerImage = require( 'image!WAVE_INTERFERENCE/speaker.png' );

  /**
   * @param {WavesScreenModel} model
   * @param {Scene} scene - TODO: after we have all nodes, this can be hardcoded to work with just sound
   * @param {Node} waveAreaNode - for bounds
   * @constructor
   */
  function SoundEmitterNode( model, scene, waveAreaNode ) {
    var options = {
      rightCenter: waveAreaNode.leftCenter.plusXY( 20, 0 ),
      scale: 0.75
    };
    var speakerNode1 = new Image( speakerImage, options );
    var button1 = new RoundStickyToggleButton( false, true, model.button1PressedProperty, {
      centerY: speakerNode1.height * 0.68,
      left: 8,

      // TODO: these are copied from LaserPointerNode and again in this file
      baseColor: 'red',
      radius: 22
    } );
    speakerNode1.addChild( button1 );

    var speakerNode2 = new Image( speakerImage, options );
    var button2 = new RoundStickyToggleButton( false, true, model.button2PressedProperty, {
      centerY: speakerNode1.height * 0.68, // TODO: why doesn't 0.5 work?
      left: 8, // TODO: duplicated

      // TODO: these are copied from LaserPointerNode
      baseColor: 'red',
      radius: 22
    } );
    speakerNode2.addChild( button2 );

    // TODO: this is duplicated in LightEmitterNode
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
      children: [ speakerNode1, speakerNode2 ]
    } );

    var lightModelViewTransform = ModelViewTransform2.createRectangleMapping( scene.getWaveAreaBounds(), waveAreaNode.bounds );

    // TODO: this is duplicated in LightEmitterNode
    scene.sourceSeparationProperty.link( function( sourceSeparation ) {
      speakerNode2.visible = sourceSeparation > 0;

      var viewSeparation = lightModelViewTransform.modelToViewDeltaY( sourceSeparation );
      speakerNode1.centerY = waveAreaNode.centerY + viewSeparation / 2;
      speakerNode2.centerY = waveAreaNode.centerY - viewSeparation / 2;
    } );
  }

  waveInterference.register( 'SoundEmitterNode', SoundEmitterNode );

  return inherit( Node, SoundEmitterNode );
} );
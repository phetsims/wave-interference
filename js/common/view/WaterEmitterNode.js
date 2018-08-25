// Copyright 2018, University of Colorado Boulder

/**
 * For the water scene, shows one hose for each emitter, each with its own on/off button.  The water drops are transient
 * and only shown as part of the view (not modeled in the model).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EmitterNode = require( 'WAVE_INTERFERENCE/common/view/EmitterNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Shape = require( 'KITE/Shape' );
  const SlitsScreenModel = require( 'WAVE_INTERFERENCE/slits/model/SlitsScreenModel' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const hoseImage = require( 'image!WAVE_INTERFERENCE/hose.png' );
  const waterDropImage = require( 'image!WAVE_INTERFERENCE/water_drop.png' );

  // constants
  const FAUCET_VERTICAL_OFFSET = -100; // how far the water drops have to fall

  class WaterEmitterNode extends EmitterNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Node} waveAreaNode - for bounds
     * @param {boolean} isPrimarySource
     */
    constructor( model, waveAreaNode, isPrimarySource ) {

      super( model, model.waterScene, waveAreaNode, 62, isPrimarySource, new Image( hoseImage, {
        rightCenter: waveAreaNode.leftCenter.plusXY( 40, 0 ),
        scale: 0.75
      } ), FAUCET_VERTICAL_OFFSET );

      // Water drops are not shown for plane waves
      if ( model instanceof SlitsScreenModel ) {
        return;
      }

      const dropLayer = new Node( {
        clipArea: Shape.rect( 0, FAUCET_VERTICAL_OFFSET, 1000, Math.abs( FAUCET_VERTICAL_OFFSET ) )
      } );
      this.addChild( dropLayer );
      dropLayer.moveToBack();

      // also shows the water drops
      const waterDrops = [];
      for ( let i = 0; i < 11; i++ ) {
        const waterDrop = new Image( waterDropImage );
        waterDrops.push( waterDrop );
        dropLayer.addChild( waterDrop );
      }

      const update = () => {
        const time = model.timeProperty.value;

        const amplitude = model.amplitudeProperty.value;
        const frequency = model.sceneProperty.value.frequencyProperty.value;
        const phase = model.phase;
        const angularFrequency = Math.PI * 2 * frequency;
        const dropSpeed = 70;

        // compute the distances of the water drops
        // the water drops hit when
        // const waveValue = -Math.sin( time * angularFrequency + phase ) * amplitudeProperty.get();
        // (time + timeToDrop )* angularFrequency + phase = 2*Math.PI*n
        // timeToDrop = (2*Math.PI*n-phase)/angularFrequency - time
        // choose n_min and n_max so everything is in range
        // timeToDrop = ( 2 * Math.PI * n - phase ) / angularFrequency - time;
        // dropPosition/dropSpeed = ( 2 * Math.PI * n - phase ) / angularFrequency - time;
        // n = ((dropPosition/dropSpeed + time) * angularFrequency + phase)/2/Math.PI
        const minPosition = -200;
        const maxPosition = 200;
        const nMin = Math.round( ( ( minPosition / dropSpeed + time ) * angularFrequency + phase ) / 2 / Math.PI );
        const nMax = Math.round( ( ( maxPosition / dropSpeed + time ) * angularFrequency + phase ) / 2 / Math.PI );
        for ( let n = 0; n < waterDrops.length; n++ ) {
          waterDrops[ n ].visible = false;
        }
        for ( let n = nMin; n < nMax; n++ ) {
          const index = n - nMin;

          waterDrops[ index ].visible = true;
          const timeToDrop = ( 2 * Math.PI * n - phase ) / angularFrequency - time;
          const dropPosition = timeToDrop * dropSpeed;

          // drop size is a function of amplitude
          waterDrops[ index ].setScaleMagnitude( amplitude / 10 / 2 + 1E-6 );
          waterDrops[ index ].bottom = -dropPosition;
          waterDrops[ index ].centerX = 157; // This value must coordinate with WavesScreenModel.POINT_SOURCE_HORIZONTAL_COORDINATE
        }
      };

      // link to appropriate properties/emitters in the model.  No dispose is needed since this node exists for the
      // lifetime of the simulation.
      model.amplitudeProperty.link( update );
      model.sceneProperty.link( update );
      model.waterScene.frequencyProperty.link( update );
      model.stepEmitter.addListener( update );
      model.button1PressedProperty.link( update );
      model.button2PressedProperty.link( update );
      model.pulseFiringProperty.link( update );

      const buttonPressedProperty = isPrimarySource ? model.button1PressedProperty : model.button2PressedProperty;
      buttonPressedProperty.link( buttonPressed => dropLayer.setVisible( buttonPressed ) );

      // Vertically offset move when there are two sources
      this.centerYProperty.link( offset => dropLayer.setY( offset ) );
    }
  }

  return waveInterference.register( 'WaterEmitterNode', WaterEmitterNode );
} );
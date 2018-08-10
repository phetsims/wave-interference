// Copyright 2018, University of Colorado Boulder

/**
 * For the water scene, shows one hose for each emitter, each with its own on/off button.  The water drops are transient
 * and only shown as part of the view (not modeled in the model).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const EmitterNode = require( 'WAVE_INTERFERENCE/common/view/EmitterNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Shape = require( 'KITE/Shape' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // images
  const hoseImage = require( 'image!WAVE_INTERFERENCE/hose.png' );
  const waterDropImage = require( 'image!WAVE_INTERFERENCE/water_drop.png' );

  class WaterEmitterNode extends EmitterNode {

    /**
     * @param {WavesScreenModel} model
     * @param {Node} waveAreaNode - for bounds
     * @param {boolean} isPrimarySource
     */
    constructor( model, waveAreaNode, isPrimarySource ) {

      // TODO: set up the alignments correctly
      const verticalOffset = -100;
      super( model, model.waterScene, waveAreaNode, 62, isPrimarySource, new Image( hoseImage, {
        rightCenter: waveAreaNode.leftCenter.plusXY( 40, 0 ),
        scale: 0.75
      } ), verticalOffset );

      const dropLayer = new Node( {
        clipArea: Shape.rect( 0, 100, 1000, 100 )
      } );
      this.addChild( dropLayer );
      dropLayer.moveToBack();

      // also shows the water drops
      // TODO: use an image strip with a pattern?  Or at least fewer images?
      const waterDrops = [];
      for ( let i = 0; i < 100; i++ ) {
        const waterDrop = new Image( waterDropImage, {
          scale: 0.5
        } );
        waterDrops.push( waterDrop );
        dropLayer.addChild( waterDrop );
      }

      const update = () => {
        const time = model.time;

        const amplitude = model.amplitudeProperty.value;
        const frequency = model.sceneProperty.value.frequencyProperty.value;
        const phase = model.phase;
        const angularFrequency = Math.PI * 2 * frequency;
        const dropSpeed = 70;

        // compute the distances of the water drops
        // the water drops hit when
        // const waveValue = -Math.sin( this.time * angularFrequency + this.phase ) * this.amplitudeProperty.get();
        // (this.time + timeToDrop )* angularFrequency + this.phase = 2*Math.PI*n
        // timeToDrop = (2*Math.PI*n-this.phase)/angularFrequency - this.time
        // choose n_min and n_max so everything is in range
        // timeToDrop = ( 2 * Math.PI * n - phase ) / angularFrequency - time;
        // dropPosition/dropSpeed = ( 2 * Math.PI * n - phase ) / angularFrequency - time;
        // n = ((dropPosition/dropSpeed + time) * angularFrequency + phase)/2/Math.PI
        // TODO: After running for a while, the drops disappear.  That probably indicates a bug with nMin/nMax or time
        // TODO: phase is wrong, sometimes drops coincide with a trough, sometimes with a peak
        const minPosition = -1000;
        const maxPosition = 1000;
        const nMin = Math.round( ( ( minPosition / dropSpeed + time ) * angularFrequency + phase ) / 2 / Math.PI );
        const nMax = Math.round( ( ( maxPosition / dropSpeed + time ) * angularFrequency + phase ) / 2 / Math.PI );
        for ( let n = 0; n < waterDrops.length; n++ ) {
          const visible = n >= nMin && n <= nMax;
          waterDrops[ n ].visible = visible;
          if ( visible ) {
            const timeToDrop = ( 2 * Math.PI * n - phase ) / angularFrequency - time;
            const dropPosition = timeToDrop * dropSpeed;

            // TODO: performance?
            // drop size is a function of amplitude
            waterDrops[ n ].setScaleMagnitude( amplitude / 10 / 2 + 1E-6 );
            waterDrops[ n ].centerY = 300 - dropPosition;
            waterDrops[ n ].centerX = 206;
          }
        }
      };

      // link to appropriate properties/emitters in the model.  No dispose is needed since this node exists for the
      // lifetime of the simulation.
      model.amplitudeProperty.link( update );
      model.sceneProperty.link( update );
      model.waterScene.frequencyProperty.link( update );
      model.stepEmitter.addListener( update );

      const buttonPressedProperty = isPrimarySource ? model.button1PressedProperty : model.button2PressedProperty;
      buttonPressedProperty.link( buttonPressed => {dropLayer.visible = buttonPressed;} );

      // TODO: some duplicated logic here.  Maybe if we don't use centerY to transform the parent, this can all be done together
      const modelViewTransform = ModelViewTransform2.createRectangleMapping( model.waterScene.getWaveAreaBounds(), waveAreaNode.bounds );
      model.waterScene.sourceSeparationProperty.link( sourceSeparation => {
        const sign = isPrimarySource ? 1 : -1;

        const viewSeparation = modelViewTransform.modelToViewDeltaY( sourceSeparation );
        dropLayer.y = waveAreaNode.centerY + sign * viewSeparation / 2 + verticalOffset - 100;
      } );
    }
  }

  return waveInterference.register( 'WaterEmitterNode', WaterEmitterNode );
} );
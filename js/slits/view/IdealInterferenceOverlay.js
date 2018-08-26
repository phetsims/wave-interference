// Copyright 2018, University of Colorado Boulder

/**
 * Shows the ideal (far field) pattern for interference, when ?dev is specified.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  const Line = require( 'SCENERY/nodes/Line' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class IdealInterferenceOverlay extends Node {

    /**
     * @param {SlitsScreenModel} model
     * @param {Object} [options]
     */
    constructor( model, viewBounds, options ) {
      super();

      this.addChild( new Text( 'hello' ) );
      this.mutate( options );

      model.stepEmitter.addListener( () => {
        this.removeAllChildren();
        const barrierType = model.barrierTypeProperty.get();
        if ( barrierType === BarrierTypeEnum.TWO_SLITS ) {

          const scene = model.sceneProperty.value;
          this.modelViewTransform = ModelViewTransform2.createRectangleMapping( scene.getWaveAreaBounds(), viewBounds );

          const barrierY = viewBounds.centerY;
          const cellWidth = ModelViewTransform2.createRectangleMapping( model.lattice.visibleBounds, viewBounds ).modelToViewDeltaX( 1 );
          const barrierX = this.modelViewTransform.modelToViewX( scene.getBarrierLocation() ) + cellWidth / 2;

          [ 'maxima', 'minima' ].forEach( type => {
            [ -1, 1 ].forEach( sign => {
              for ( let m = 0; m < 20; m++ ) {

                // d sin(θ) = mλ for maxima,
                // d sin(θ) = (m + 1/2)λ for minima
                // see http://electron9.phys.utk.edu/optics421/modules/m1/diffraction_and_interference.htm
                const addition = type === 'maxima' ? 0 : 0.5;
                const arg = ( m + addition ) * scene.wavelength / scene.slitSeparationProperty.value;

                // make sure in bounds
                if ( arg <= 1 ) {
                  const theta = sign * Math.asin( arg );

                  const length = 500;
                  const x = length * Math.cos( theta );
                  const y = length * Math.sin( theta );
                  const line = new Line( barrierX, barrierY, barrierX + x, barrierY + y, {
                    stroke: type === 'maxima' ? 'yellow' : 'red',
                    lineWidth: 1
                  } );
                  this.addChild( line );
                }
              }
            } );
          } );

        }
      } );

    }
  }

  return waveInterference.register( 'IdealInterferenceOverlay', IdealInterferenceOverlay );
} );
// Copyright 2018, University of Colorado Boulder

/**
 * Shows the theoretical/ideal (far field) pattern for interference, when ?theory is specified, see
 * https://github.com/phetsims/wave-interference/issues/136
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
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  const LENGTH = 500;
  const MAXIMUM_COLOR = 'yellow';
  const MINIMUM_COLOR = 'red';
  const LINE_WIDTH = 1;

  class TheoryInterferenceOverlay extends Node {

    /**
     * @param {SlitsScreenModel} model
     * @param {Bounds2} viewBounds - the area where the lattice appears
     * @param {Object} [options]
     */
    constructor( model, viewBounds, options ) {
      super();

      this.mutate( options );

      const updateLines = () => {
        this.removeAllChildren();
        const barrierType = model.sceneProperty.value.barrierTypeProperty.get();
        if ( barrierType !== BarrierTypeEnum.NO_BARRIER ) {

          const scene = model.sceneProperty.value;
          this.modelViewTransform = ModelViewTransform2.createRectangleMapping( scene.getWaveAreaBounds(), viewBounds );

          const barrierY = viewBounds.centerY;
          const cellWidth = ModelViewTransform2.createRectangleMapping( scene.lattice.visibleBounds, viewBounds )
            .modelToViewDeltaX( 1 );
          const barrierX = this.modelViewTransform.modelToViewX( scene.getBarrierLocation() ) + cellWidth / 2;

          // Render all the minima and maxima on both sides of the origin
          for ( let type of [ 'maxima', 'minima' ] ) {
            for ( let sign of [ -1, 1 ] ) {

              // Limit the maximum number of lines that can be shown on each side.
              for ( let m = 0; m < 20; m++ ) {

                // For double-slit:
                // d sin(θ) = mλ for maxima,
                // d sin(θ) = (m + 1/2)λ for minima
                // see http://electron9.phys.utk.edu/optics421/modules/m1/diffraction_and_interference.htm

                if ( barrierType === BarrierTypeEnum.TWO_SLITS ) {
                  const addition = type === 'maxima' ? 0 : 0.5;
                  const separation = scene.slitSeparationProperty.value;
                  const arg = ( m + addition ) * scene.wavelength / separation;

                  // make sure in bounds
                  if ( arg <= 1 ) {
                    const theta = sign * Math.asin( arg );

                    const x = LENGTH * Math.cos( theta );
                    const y = LENGTH * Math.sin( theta );
                    const line = new Line( barrierX, barrierY, barrierX + x, barrierY + y, {
                      stroke: type === 'maxima' ? MAXIMUM_COLOR : MINIMUM_COLOR,
                      lineWidth: LINE_WIDTH
                    } );
                    this.addChild( line );
                  }
                }

                // For single slit
                // a sin(θ) = mλ for minima
                // a sin(θ) = (m+1/2)λ for maxima
                // see http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/sinslit.html
                if ( barrierType === BarrierTypeEnum.ONE_SLIT ) {
                  const addition = type === 'minima' ? 0 : 0.5;
                  const aperture = scene.slitWidthProperty.value;
                  const arg = ( m + addition ) * scene.wavelength / aperture;

                  // make sure in bounds.  Single slit begins at m=1
                  if ( arg <= 1 && m > 0 ) {
                    const theta = sign * Math.asin( arg );

                    const x = LENGTH * Math.cos( theta );
                    const y = LENGTH * Math.sin( theta );
                    const line = new Line( barrierX, barrierY, barrierX + x, barrierY + y, {
                      stroke: type === 'maxima' ? MAXIMUM_COLOR : MINIMUM_COLOR,
                      lineWidth: LINE_WIDTH
                    } );
                    this.addChild( line );
                  }
                }
              }
            }
          }

          // Strong central maximum for one slit, not covered by the math above
          if ( barrierType === BarrierTypeEnum.ONE_SLIT ) {
            this.addChild( new Line( barrierX, barrierY, barrierX + LENGTH, barrierY, {
              stroke: MAXIMUM_COLOR,
              lineWidth: LINE_WIDTH
            } ) );
          }
        }
      };

      model.sceneProperty.link( updateLines );
      model.scenes.forEach( scene => {

        // When any of the relevant physical Properties change, update the lines.
        scene.barrierTypeProperty.link( updateLines );
        scene.frequencyProperty.link( updateLines );
        scene.slitSeparationProperty.link( updateLines );
        scene.barrierLocationProperty.link( updateLines );
        scene.slitWidthProperty.link( updateLines );
      } );
    }
  }

  return waveInterference.register( 'TheoryInterferenceOverlay', TheoryInterferenceOverlay );
} );
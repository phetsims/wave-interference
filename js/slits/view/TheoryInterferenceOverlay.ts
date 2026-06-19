// Copyright 2018-2026, University of Colorado Boulder

/**
 * Shows the theoretical/ideal (far field) pattern for interference, when ?theory is specified, see
 * https://github.com/phetsims/wave-interference/issues/136
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import { BarrierType } from '../../common/model/BarrierType.js';
import Scene from '../../common/model/Scene.js';
import WaterScene from '../../common/model/WaterScene.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';

// constants
const LENGTH = 1000;
const MAXIMUM_COLOR = 'yellow';
const MINIMUM_COLOR = PhetColorScheme.RED_COLORBLIND;
const LINE_WIDTH = 1;

type SelfOptions = {

  // On the interference screen, the theory pattern is always shown for 2 sources even though 0, 1 or 2 sources
  // may be oscillating
  interferenceScreen?: boolean;
};

type TheoryInterferenceOverlayOptions = SelfOptions & NodeOptions;

class TheoryInterferenceOverlay extends Node {

  /**
   * @param sceneProperty - the selected scene
   * @param scenes - all scenes whose physical Properties should trigger a redraw
   * @param viewBounds - the area where the lattice appears
   * @param [providedOptions]
   */
  public constructor( sceneProperty: TReadOnlyProperty<Scene>, scenes: Scene[], viewBounds: Bounds2, providedOptions?: TheoryInterferenceOverlayOptions ) {
    const options = optionize<TheoryInterferenceOverlayOptions, SelfOptions, NodeOptions>()( {
      interferenceScreen: true
    }, providedOptions );
    super( options );

    const updateLines = () => {
      this.removeAllChildren();

      // barrierTypeProperty is optional on Scene; on the slits screen it always exists.
      const barrierType: BarrierType = options.interferenceScreen ? 'twoSlits' :
                                       sceneProperty.value.barrierTypeProperty!.value;
      if ( barrierType !== 'noBarrier' ) {

        const scene = sceneProperty.value;
        const barrierY = viewBounds.centerY;

        // The transform is filled in once the view bounds are set, which has happened by the time this overlay updates.
        const latticeToViewTransform = scene.latticeToViewTransform!;
        const cellWidth = latticeToViewTransform.modelToViewDeltaX( 1 );
        const modelX = options.interferenceScreen ? WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE :
                       scene.barrierLatticeCoordinateProperty.value;
        const barrierX = latticeToViewTransform.modelToViewX( modelX ) + cellWidth / 2;

        // Render all the minima and maxima on both sides of the origin
        [ 'maxima', 'minima' ].forEach( type => {
          [ -1, 1 ].forEach( sign => {

            /**
             * Adds a line for the given maximum or minimum
             * @param arg - argument to the arcsin
             */
            const addLine = ( arg: number ) => {
              const theta = sign * Math.asin( arg );

              const x = LENGTH * Math.cos( theta );
              const y = LENGTH * Math.sin( theta );
              const line = new Line( barrierX, barrierY, barrierX + x, barrierY + y, {
                stroke: type === 'maxima' ? MAXIMUM_COLOR : MINIMUM_COLOR,
                lineWidth: LINE_WIDTH
              } );
              this.addChild( line );
            };

            // Limit the maximum number of lines that can be shown on each side.
            for ( let m = 0; m < 20; m++ ) {

              // For double-slit:
              // d sin(θ) = mλ for maxima,
              // d sin(θ) = (m + 1/2)λ for minima
              // see http://electron9.phys.utk.edu/optics421/modules/m1/diffraction_and_interference.htm

              // Use the desired wavelength when drops are present, so we don't have to wait for the drops to hit the
              // lattice.  There are no drops on the "slits" screeen.  getDesiredWavelength and
              // desiredSourceSeparationProperty are only defined on WaterScene, so narrow with instanceof.
              const waterScene = scene instanceof WaterScene ? scene : null;
              const wavelength = ( waterScene && options.interferenceScreen ) ? waterScene.getDesiredWavelength() :
                                 scene.getWavelength();
              if ( barrierType === 'twoSlits' ) {
                const addition = type === 'maxima' ? 0 : 0.5;
                const separation = options.interferenceScreen && waterScene ? waterScene.desiredSourceSeparationProperty.value :
                                   options.interferenceScreen && !waterScene ? scene.sourceSeparationProperty.value :
                                   scene.slitSeparationProperty.value;
                const arg = ( m + addition ) * wavelength / separation;

                // make sure in bounds
                if ( arg <= 1 ) {
                  addLine( arg );
                }
              }

              // For single slit
              // a sin(θ) = mλ for minima
              // a sin(θ) = (m+1/2)λ for maxima
              // see http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/sinslit.html
              if ( barrierType === 'oneSlit' ) {
                const addition = type === 'minima' ? 0 : 0.5;
                const aperture = scene.slitWidthProperty.value;
                const arg = ( m + addition ) * wavelength / aperture;

                // make sure in bounds.  Single slit begins at m=1
                if ( arg <= 1 && m > 0 ) {
                  addLine( arg );
                }
              }
            }
          } );
        } );

        // Strong central maximum for one slit, not covered by the math above
        if ( barrierType === 'oneSlit' ) {
          this.addChild( new Line( barrierX, barrierY, barrierX + LENGTH, barrierY, {
            stroke: MAXIMUM_COLOR,
            lineWidth: LINE_WIDTH
          } ) );
        }
      }
    };

    sceneProperty.link( updateLines );
    scenes.forEach( scene => {

      // When any of the relevant physical Properties change, update the lines.  barrierTypeProperty exists on the
      // slits/plane-wave scenes where this runs.
      if ( !options.interferenceScreen ) {
        scene.barrierTypeProperty!.link( updateLines );
      }
      scene.frequencyProperty.link( updateLines );
      scene.slitSeparationProperty.link( updateLines );
      scene.sourceSeparationProperty.link( updateLines );
      scene.barrierLatticeCoordinateProperty.link( updateLines );
      scene.slitWidthProperty.link( updateLines );

      // Wire up to desired values in WaterScene
      if ( scene instanceof WaterScene ) {
        scene.desiredFrequencyProperty.link( updateLines );
        scene.desiredSourceSeparationProperty.link( updateLines );
      }
    } );
  }
}

export default TheoryInterferenceOverlay;

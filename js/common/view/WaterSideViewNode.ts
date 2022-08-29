// Copyright 2018-2022, University of Colorado Boulder

/**
 * Shows the water from the side view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Path } from '../../../../scenery/js/imports.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../WaveInterferenceUtils.js';
import WaterScene from '../model/WaterScene.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// constants
// the index in the un-padded lattice array where the source appears
const SOURCE_INDEX = WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE -
                     WaveInterferenceConstants.LATTICE_PADDING;

class WaterSideViewNode extends Path {

  // reduce garbage by reusing the same array to get model values
  private readonly array = [];
  private waterSideViewNodeTopY: number | null = null;

  public constructor( private readonly waveAreaBounds: Bounds2, private readonly waterScene: WaterScene ) {

    super( null, {
      lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN,
      fill: WaveInterferenceConstants.WATER_SIDE_COLOR
    } );

    this.waveAreaBounds = waveAreaBounds;
    this.waterScene = waterScene;

    waterScene.lattice.changedEmitter.addListener( () => this.update() );
  }

  /**
   * update the shape when the rotationAmount or lattice has changed
   */
  private update(): void {
    const bounds = this.waveAreaBounds;
    const waterSideShape = WaveInterferenceUtils.getWaterSideShape( this.array, this.waterScene.lattice, bounds, 0, 0 );
    this.shape = waterSideShape
      .lineTo( waterSideShape.bounds.right, bounds.maxY )
      .lineTo( waterSideShape.bounds.left, bounds.maxY )
      .close();

    // Look up the height of the topmost curve.  Do this after getWaterSideShape since we read a value
    // from the array.  Used to determine if a water drop has fallen into the water.
    this.waterSideViewNodeTopY = WaveInterferenceUtils.getWaterSideY( bounds, this.array[ SOURCE_INDEX ] );
  }
}

waveInterference.register( 'WaterSideViewNode', WaterSideViewNode );
export default WaterSideViewNode;

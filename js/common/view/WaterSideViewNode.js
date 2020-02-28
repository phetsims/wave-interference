// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the water from the side view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Path from '../../../../scenery/js/nodes/Path.js';
import waveInterference from '../../waveInterference.js';
import WaveInterferenceConstants from '../WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../WaveInterferenceUtils.js';

// constants
// the location in the un-padded lattice array where the source appears
const SOURCE_INDEX = WaveInterferenceConstants.POINT_SOURCE_HORIZONTAL_COORDINATE -
                     WaveInterferenceConstants.LATTICE_PADDING;

class WaterSideViewNode extends Path {

  /**
   * @param {Bounds2} waveAreaBounds
   * @param {WaterScene} waterScene
   */
  constructor( waveAreaBounds, waterScene ) {

    super( null, {
      lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN,
      fill: WaveInterferenceConstants.WATER_SIDE_COLOR
    } );

    // @private
    this.waveAreaBounds = waveAreaBounds;

    // @private
    this.waterScene = waterScene;

    // @private - reduce garbage by reusing the same array to get model values
    this.array = [];

    waterScene.lattice.changedEmitter.addListener( () => this.update() );
  }

  /**
   * @private - update the shape when the rotationAmount or lattice has changed
   */
  update() {
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
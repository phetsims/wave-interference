// Copyright 2018-2021, University of Colorado Boulder

/**
 * Reusable Image nodes that show WaterDrops.  Each WaterDropImage can be repurposed for different waterDrops (like
 * pooling) so they aren't dynamically created or garbage collected at all.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image } from '../../../../scenery/js/imports.js';
import water_drop_png from '../../../images/water_drop_png.js';
import waveInterference from '../../waveInterference.js';

class WaterDropImage extends Image {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( water_drop_png, options );

    // @public {WaterDrop|null} - Link to the corresponding WaterDrop (if any), so that when the view goes underwater,
    // we can mark the corresponding model as absorbed.  These nodes are recycled--created with null instead of a
    // specific WaterDrop and assigned to null when the associated WaterDrop has been absorbed.
    this.waterDrop = null;
  }
}

waveInterference.register( 'WaterDropImage', WaterDropImage );
export default WaterDropImage;
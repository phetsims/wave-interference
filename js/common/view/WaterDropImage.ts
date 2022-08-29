// Copyright 2018-2022, University of Colorado Boulder

/**
 * Reusable Image nodes that show WaterDrops.  Each WaterDropImage can be repurposed for different waterDrops (like
 * pooling) so they aren't dynamically created or garbage collected at all.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Image, ImageOptions } from '../../../../scenery/js/imports.js';
import water_drop_png from '../../../images/water_drop_png.js';
import waveInterference from '../../waveInterference.js';
import WaterDrop from '../model/WaterDrop.js';

class WaterDropImage extends Image {

  // Link to the corresponding WaterDrop (if any), so that when the view goes underwater,
  // we can mark the corresponding model as absorbed.  These nodes are recycled--created with null instead of a
  // specific WaterDrop and assigned to null when the associated WaterDrop has been absorbed.
  public waterDrop: WaterDrop | null = null;

  public constructor( options?: ImageOptions ) {
    super( water_drop_png, options );
  }
}

waveInterference.register( 'WaterDropImage', WaterDropImage );
export default WaterDropImage;
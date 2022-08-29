// Copyright 2018-2022, University of Colorado Boulder
// @ts-nocheck
/**
 * Vertical cylinder with a button that produces the plane wave along the left edge of the wave area.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Image, Node, Rectangle } from '../../../../scenery/js/imports.js';
import RoundStickyToggleButton from '../../../../sun/js/buttons/RoundStickyToggleButton.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import plane_wave_source_png from '../../../images/plane_wave_source_png.js';
import SceneToggleNode from '../../common/view/SceneToggleNode.js';
import WaveInterferenceText from '../../common/view/WaveInterferenceText.js';
import WaveInterferenceConstants from '../../common/WaveInterferenceConstants.js';
import waveInterference from '../../waveInterference.js';

class PlaneWaveGeneratorNode extends Node {

  public constructor( model, waveAreaBounds, options ) {
    super();
    const verticalCylinderImageNode = new Image( plane_wave_source_png, {
      scale: waveAreaBounds.height / ( plane_wave_source_png.height - 52 ),
      rightCenter: waveAreaBounds.leftCenter.plusXY( 2, 0 )
    } );

    const button = new SceneToggleNode(
      model,
      scene => new RoundStickyToggleButton( scene.button1PressedProperty, false, true, {
        scale: 1.2,
        baseColor: WaveInterferenceConstants.WAVE_GENERATOR_BUTTON_COLOR,
        radius: WaveInterferenceConstants.WAVE_GENERATOR_BUTTON_RADIUS,
        touchAreaDilation: WaveInterferenceConstants.WAVE_GENERATOR_BUTTON_TOUCH_AREA_DILATION
      } ), {
        center: verticalCylinderImageNode.center
      } );

    assert && assert( !options || !options.children, 'children would be overwritten in PlaneWaveGeneratorNode' );
    options = merge( { children: [ verticalCylinderImageNode, button ] }, options );

    this.mutate( options );

    // Show descriptive text label
    this.addChild( new SceneToggleNode( model, scene => {
      const textNode = new WaveInterferenceText( scene.planeWaveGeneratorNodeText, {
        rotation: -Math.PI / 2,

        // About the same amount of space between the button and the text as between the text and the bottom
        maxWidth: 180
      } );
      const backgroundNode = Rectangle.bounds( textNode.bounds.dilated( 4 ), {
        fill: 'white',
        opacity: 0.2
      } );
      return new Node( {
        children: [ backgroundNode, textNode ]
      } );
    }, {
      centerX: this.centerX,
      top: verticalCylinderImageNode.top + 42,
      alignChildren: ToggleNode.BOTTOM
    } ) );
  }
}

waveInterference.register( 'PlaneWaveGeneratorNode', PlaneWaveGeneratorNode );
export default PlaneWaveGeneratorNode;
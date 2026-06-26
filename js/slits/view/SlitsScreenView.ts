// Copyright 2018-2026, University of Colorado Boulder

/**
 * ScreenView for the Slits screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Shape from '../../../../kite/js/Shape.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import WaveInterferenceQueryParameters from '../../common/WaveInterferenceQueryParameters.js';
import WavesScreenView from '../../waves/view/WavesScreenView.js';
import SlitsModel from '../model/SlitsModel.js';
import BarriersNode from './BarriersNode.js';
import PlaneWaveGeneratorNode from './PlaneWaveGeneratorNode.js';
import SlitsControlPanel from './SlitsControlPanel.js';
import TheoryInterferenceOverlay from './TheoryInterferenceOverlay.js';

class SlitsScreenView extends WavesScreenView {

  /**
   * @param model
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   */
  public constructor( model: SlitsModel, alignGroup: AlignGroup ) {
    super( model, alignGroup, {
      showPulseContinuousRadioButtons: false,

      // Show the plane wave generator instead of the individual scene-specific emitters
      showSceneSpecificWaveGeneratorNodes: false
    } );

    // The Slits screen has an additional control panel below the main control panel, which controls the barrier/slits
    const slitControlPanel = new SlitsControlPanel(
      alignGroup, model.sceneProperty, model.waterScene, model.soundScene, model.lightScene, this
    );

    // When the alignGroup changes the size of the slitsControlPanel, readjust its positioning.  Should only happen
    // during startup.  Use the same pattern as required in WavesScreenView for consistency.
    const updateSlitControlPanel = () => {
      slitControlPanel.mutate( {
        left: this.controlPanel.left,
        top: this.controlPanel.bottom + WavesScreenView.SPACING
      } );
    };
    updateSlitControlPanel();
    slitControlPanel.boundsProperty.lazyLink( updateSlitControlPanel );
    this.controlPanel.boundsProperty.lazyLink( updateSlitControlPanel );
    this.addChild( slitControlPanel );

    // The slit control panel is an additional control-area panel, traversed right after the main control panel.
    this.additionalControlAreaNodes.push( slitControlPanel );

    // Make sure tools go in front of this control panel, see https://github.com/phetsims/wave-interference/issues/218
    slitControlPanel.moveToBack();

    // Show the barriers when appropriate. Cannot use ToggleNode because of asymmetry, see the multilink
    // The Slits screen always has all three scenes, so the non-null assertions are safe.
    const waterBarriersNode = new BarriersNode( model, model.waterScene!, this.waveAreaNode.bounds );
    const soundBarriersNode = new BarriersNode( model, model.soundScene!, this.waveAreaNode.bounds );
    const lightBarriersNode = new BarriersNode( model, model.lightScene!, this.waveAreaNode.bounds );
    Multilink.multilink(
      [ model.sceneProperty, model.rotationAmountProperty, model.isRotatingProperty, model.viewpointProperty ],
      ( scene, rotationAmount, isRotating, viewpoint ) => {

        // Hide the barriers for water side view and while rotating
        const hide = scene === model.waterScene && viewpoint === 'side' || isRotating;
        waterBarriersNode.visible = !hide && scene === model.waterScene;
        soundBarriersNode.visible = !hide && scene === model.soundScene;
        lightBarriersNode.visible = !hide && scene === model.lightScene;
      } );
    this.afterWaveAreaNode.addChild( waterBarriersNode );
    this.afterWaveAreaNode.addChild( soundBarriersNode );
    this.afterWaveAreaNode.addChild( lightBarriersNode );

    // When enabled by a query parameter, show the theoretical interference pattern.
    if ( WaveInterferenceQueryParameters.theory ) {
      this.addChild( new TheoryInterferenceOverlay( model.sceneProperty, model.scenes, this.waveAreaNode.bounds, {
        interferenceScreen: false,
        clipArea: Shape.bounds( this.waveAreaNode.bounds )
      } ) );
    }

    // Show the plane wave generator instead of the individual scene-specific emitters.
    const planeWaveGeneratorNode = new PlaneWaveGeneratorNode( model, this.waveAreaNode.bounds );

    // waveGeneratorLayer is created by the superclass because showSceneSpecificWaveGeneratorNodes is false above.
    this.waveGeneratorLayer!.addChild( planeWaveGeneratorNode );

    // The plane-wave generator is this screen's wave source on/off control, so it leads the play-area traversal order.
    this.additionalPlayAreaNodes.push( planeWaveGeneratorNode );
    this.updateTraversalOrder();
  }
}

export default SlitsScreenView;

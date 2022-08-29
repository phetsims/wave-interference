// Copyright 2018-2022, University of Colorado Boulder

/**
 * ScreenView for the "Interference" screen.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { AlignGroup } from '../../../../scenery/js/imports.js';
import WaveInterferenceQueryParameters from '../../common/WaveInterferenceQueryParameters.js';
import TheoryInterferenceOverlay from '../../slits/view/TheoryInterferenceOverlay.js';
import waveInterference from '../../waveInterference.js';
import WavesScreenView from '../../waves/view/WavesScreenView.js';
import SeparationControl from './SeparationControl.js';
import InterferenceModel from '../model/InterferenceModel.js';

class InterferenceScreenView extends WavesScreenView {

  /**
   * @param model
   * @param alignGroup - for aligning the control panels on the right side of the lattice
   */
  public constructor( model: InterferenceModel, alignGroup: AlignGroup ) {

    super( model, alignGroup, {

      // The pulse option does not appear in the Interference screen, because it is distracting and does not meet a
      // specific learning goal in this context.
      showPulseContinuousRadioButtons: false,
      controlPanelOptions: {
        additionalControl: new SeparationControl( model )
      }
    } );

    // When enabled by a query parameter, show the theoretical interference pattern.
    if ( WaveInterferenceQueryParameters.theory ) {
      this.addChild( new TheoryInterferenceOverlay( model.sceneProperty, model.scenes, this.waveAreaNode.bounds, {
        clipArea: Shape.bounds( this.waveAreaNode.bounds )
      } ) );
    }
  }
}

waveInterference.register( 'InterferenceScreenView', InterferenceScreenView );
export default InterferenceScreenView;
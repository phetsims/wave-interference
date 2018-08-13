// Copyright 2018, University of Colorado Boulder

/**
 * Adds the panel to the wave detector background.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const WaveDetectorToolContentNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolContentNode' );
  const WaveDetectorToolNode = require( 'WAVE_INTERFERENCE/common/view/WaveDetectorToolNode' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  class WaveInterferenceWaveDetectorToolNode extends WaveDetectorToolNode {

    /**
     * @param {WavesScreenModel} model - model for reading values
     * @param {WavesScreenView|null} view - for getting coordinates for model
     * @param {Object} [options]
     */
    constructor( model, view, options ) {
      super( options );

      const waveDetectorToolContentNode = new WaveDetectorToolContentNode( model, view, this.backgroundNode, this.probe1Node, this.probe2Node, options );
      this.addChild( waveDetectorToolContentNode );
    }
  }

  return waveInterference.register( 'WaveInterferenceWaveDetectorToolNode', WaveInterferenceWaveDetectorToolNode );
} );
// Copyright 2018, University of Colorado Boulder

/**
 * Shows the water from the side view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Path = require( 'SCENERY/nodes/Path' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );

  class WaterSideViewNode extends Path {

    /**
     * @param {Bounds2} waveAreaBounds
     * @param {WavesScreenModel} model
     */
    constructor( waveAreaBounds, model ) {

      // @private - depicts the side face (when the user selects "side view")
      super( null, {
        lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN,
        fill: WaveInterferenceConstants.WATER_SIDE_COLOR
      } );

      // @private
      this.waveAreaBounds = waveAreaBounds;

      // @private
      this.model = model;

      // @private - reduce garbage by reusing the same array to get model values
      this.array = [];

      model.lattice.changedEmitter.addListener( this.update.bind( this ) );
    }

    /**
     * @private - update the shape when the rotationAmount or lattice has changed
     */
    update() {
      this.shape = WaveInterferenceUtils.getWaterSideShape( this.array, this.model.lattice, this.waveAreaBounds, 0, 0 )
        .lineTo( this.waveAreaBounds.right, this.waveAreaBounds.maxY )
        .lineTo( this.waveAreaBounds.left, this.waveAreaBounds.maxY )
        .close();

      // TODO: hack alert on the cell location
      this.topY = WaveInterferenceUtils.getWaterSideY( this.waveAreaBounds, this.array[ 3 ] );
    }
  }

  return waveInterference.register( 'WaterSideViewNode', WaterSideViewNode );
} );
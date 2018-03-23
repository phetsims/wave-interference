// Copyright 2018, University of Colorado Boulder

/**
 * Shows the water from the side view.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarrierTypeEnum = require( 'WAVE_INTERFERENCE/slits/model/BarrierTypeEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {WavesScreenModel} model
   * @param {Bounds2} waveAreaBounds
   * @constructor
   */
  function BarriersNode( model, waveAreaBounds ) {

    // @private
    this.waveAreaBounds = waveAreaBounds;

    // @private
    this.model = model;

    Node.call( this );

    var updateCallback = this.update.bind( this );
    model.barrierTypeProperty.link( updateCallback );
    model.barrierLocationProperty.link( updateCallback );
    model.slitWidthProperty.link( updateCallback );
  }

  waveInterference.register( 'BarriersNode', BarriersNode );

  return inherit( Node, BarriersNode, {

    /**
     * @private - update the shapes and text when the rotationAmount has changed
     */
    update: function() {
      this.removeAllChildren();
      var barrierType = this.model.barrierTypeProperty.get();
      var lattice = this.model.lattice;
      var dampX = lattice.dampX;
      var dampY = lattice.dampY;
      var slitWidth = this.model.slitWidthProperty.get();

      // TODO: factor out this pattern that maps lattice coordinates to view coordinates
      var x1 = Util.linear( dampX, lattice.width - dampX - 1, this.waveAreaBounds.left, this.waveAreaBounds.right, this.model.barrierLocationProperty.get() );
      var x2 = Util.linear( dampX, lattice.width - dampX - 1, this.waveAreaBounds.left, this.waveAreaBounds.right, this.model.barrierLocationProperty.get() + 1 );

      if ( barrierType === BarrierTypeEnum.NO_BARRIER ) {
        return;
      }
      else if ( barrierType === BarrierTypeEnum.MIRROR ) {
        this.addChild( new Rectangle( x1, this.waveAreaBounds.top, x2 - x1, this.waveAreaBounds.height, 2, 2, {
          fill: '#f3d99b',
          stroke: 'black',
          lineWidth: 1
        } ) );
      }
      else if ( barrierType === BarrierTypeEnum.ONE_SLIT ) {
        var y1 = Util.linear( dampY, lattice.height - dampY - 1, this.waveAreaBounds.top, this.waveAreaBounds.bottom, lattice.height / 2 - slitWidth / 2 );
        var y2 = Util.linear( dampY, lattice.height - dampY - 1, this.waveAreaBounds.top, this.waveAreaBounds.bottom, lattice.height / 2 + slitWidth / 2 );
        this.addChild( new Rectangle( x1, this.waveAreaBounds.top, x2 - x1, y1 - this.waveAreaBounds.top, 2, 2, {
          fill: '#f3d99b',
          stroke: 'black',
          lineWidth: 1
        } ) );
        this.addChild( new Rectangle( x1, y2, x2 - x1, this.waveAreaBounds.bottom - y2, 2, 2, {
          fill: '#f3d99b',
          stroke: 'black',
          lineWidth: 1
        } ) );
      }
    }
  } );
} );
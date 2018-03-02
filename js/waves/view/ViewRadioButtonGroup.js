// Copyright 2018, University of Colorado Boulder

/**
 * Selects between Top View and Side View.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var ViewTypeEnum = require( 'WAVE_INTERFERENCE/waves/model/ViewTypeEnum' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  /**
   * @param {Property.<ViewTypeEnum>} viewTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function ViewRadioButtonGroup( viewTypeProperty, options ) {
    options = _.extend( { spacing: 8 }, options );
    VerticalAquaRadioButtonGroup.call( this, [ {
      node: new Text( 'Top View', { fontSize: 16 } ),
      value: ViewTypeEnum.TOP,
      property: viewTypeProperty
    }, {
      node: new Text( 'Side View', { fontSize: 16 } ),
      value: ViewTypeEnum.SIDE,
      property: viewTypeProperty
    } ], options );
  }

  waveInterference.register( 'ViewRadioButtonGroup', ViewRadioButtonGroup );

  return inherit( VerticalAquaRadioButtonGroup, ViewRadioButtonGroup );
} );
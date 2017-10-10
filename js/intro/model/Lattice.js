// Copyright 2017, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix = require( 'DOT/Matrix' );
  var waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );

  // constants
  var c = 0.5;
  var cSquared = c * c;

  /**
   * @constructor
   */
  function Lattice( width, height, dampX, dampY, getPotential ) {
    var numMatrices = 3;
    this.dampX = dampX;
    this.dampY = dampY;
    this.matrices = [];
    for ( var i = 0; i < numMatrices; i++ ) {
      this.matrices.push( new Matrix( width, height ) );
    }
    this.currentMatrixIndex = 0;
    this.getPotential = getPotential || function() {return 0;};
    this.changedEmitter = new Emitter();
  }

  waveInterference.register( 'Lattice', Lattice );

  return inherit( Object, Lattice, {
    getCurrentValue: function( i, j ) {
      return this.matrices[ this.currentMatrixIndex ].get( i, j );
    },
    setCurrentValue: function( i, j, value ) {
      this.matrices[ this.currentMatrixIndex ].set( i, j, value );
    },

    getLastValue: function( i, j ) {
      return this.matrices[ (this.currentMatrixIndex + 1) % this.matrices.length ].get( i, j );
    },
    setLastValue: function( i, j, value ) {
      this.matrices[ (this.currentMatrixIndex + 1) % this.matrices.length ].set( i, j, value );
    },

    // Sets values for all history times
    setInitialValue: function( i, j, value ) {
      for ( var index = 0; index < this.matrices.length; index++ ) {
        this.matrices[ index ].set( i, j, value );
      }
    },
    get width() {
      return this.matrices[ 0 ].getRowDimension();
    },
    get height() {
      return this.matrices[ 0 ].getColumnDimension();
    },


    // Do we need this and dampScale?
    dampHorizontalROOT: function( j, dj, matrix0, matrix2 ) {
      for ( var i = 0; i < this.width; i++ ) {
        matrix0.set( i, j, matrix2.get( i, j + dj ) );
      }
    },

    dampVerticalROOT: function( i, di, matrix0, matrix2 ) {
      for ( var j = 0; j < this.height; j++ ) {
        matrix0.set( i, j, matrix2.get( i + di, j ) );
      }
    },

    dampScale: function() {
      this.dampVerticalSUB( 0, +1, this.dampY / 2 );
      this.dampVerticalSUB( this.width - 1, -1, this.dampY / 2 );
      this.dampHorizontalSUB( 0, +1, this.dampX / 2 );
      this.dampHorizontalSUB( this.height - 1, -1, this.dampX / 2 );
    },

    dampVerticalSUB: function( origin, sign, numDampPts ) {
      for ( var j = 0; j < this.height; j++ ) {
        for ( var step = 0; step < numDampPts; step++ ) {
          var distFromDampBoundary = numDampPts - step;
          var damp = this.getDamp( distFromDampBoundary );
          var i = origin + step * sign;
          this.setCurrentValue( i, j, this.getCurrentValue( i, j ) * damp );
          this.setLastValue( i, j, this.getLastValue( i, j ) * damp );
        }
      }
    },

    dampHorizontalSUB: function( origin, sign, numDampPts ) {
      for ( var i = 0; i < this.width; i++ ) {
        for ( var step = 0; step < numDampPts; step++ ) {
          var distFromDampBoundary = numDampPts - step;
          var damp = this.getDamp( distFromDampBoundary );
          var j = origin + step * sign;
          this.setCurrentValue( i, j, this.getCurrentValue( i, j ) * damp );
          this.setLastValue( i, j, this.getLastValue( i, j ) * damp );
        }
      }
    },

    getDamp: function( depthInDampRegion ) {
      return (1 - depthInDampRegion * 0.0001);
    },

    step: function( dt ) {
      this.currentMatrixIndex = (this.currentMatrixIndex - 1 + this.matrices.length) % this.matrices.length;

      var matrix0 = this.matrices[ (this.currentMatrixIndex + 0) % this.matrices.length ];
      var matrix1 = this.matrices[ (this.currentMatrixIndex + 1) % this.matrices.length ];
      var matrix2 = this.matrices[ (this.currentMatrixIndex + 2) % this.matrices.length ];
      var width = matrix0.getRowDimension();
      var height = matrix0.getColumnDimension();
      for ( var i = 1; i < width - 1; i++ ) {
        for ( var j = 1; j < height - 1; j++ ) {
          if ( this.getPotential( i, j ) !== 0 ) {
            matrix0.set( i, j, 0 );
          }
          else {
            var neighborSum = matrix1.get( i + 1, j ) + matrix1.get( i - 1, j ) + matrix1.get( i, j + 1 ) + matrix1.get( i, j - 1 );
            var term = cSquared * (neighborSum + matrix1.get( i, j ) * -4);
            matrix0.set( i, j, matrix1.get( i, j ) * 2 - matrix2.get( i, j ) + term );
          }
        }
      }

      this.dampHorizontalROOT( this.dampY, 1, matrix0, matrix2 );
      this.dampHorizontalROOT( this.height - 1 - this.dampY, -1, matrix0, matrix2 );
      this.dampVerticalROOT( this.dampX, +1, matrix0, matrix2 );
      this.dampVerticalROOT( this.width - 1 - this.dampX, -1, matrix0, matrix2 );

      this.dampScale();

      this.changedEmitter.emit();
    }
  } );
} );
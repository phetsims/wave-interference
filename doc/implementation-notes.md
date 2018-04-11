The Wave Interference simulation was ported from Java in 2018.  The first 3 screens show a 2D lattice and wave
propagation, while the final screen shows the interference pattern from a slit with a given 2d shape.

The first three screens are mainly coded in js/common.

There are 3 coordinate frames:
* view coordinates
* lattice coordinates (integer), with damping regions
* model metric coordinates (such as cm), corresponding to physical measures

There is only a single lattice, so all waves are combined and cannot be isolated.  The light panel cannot show multiple
colors at the same time.

Pseudocode from the Java Wave Interference Model:
WaveInterferenceModel:
  time += dt;
  waveModel.propagate();
  primaryOscillator.setTime( getTime() );
  secondaryOscillator.setTime( getTime() );

propagate:
  Copy to large lattice with damping regions (20 20 20 20)
    Copy to old lattice (cycle references)
    Evaluate wave equation on cells (with potential values set to 0)
    dampHorizontal( w, 0, +1 );
    dampHorizontal( w, w.getHeight() - 1, -1 );
    dampVertical( w, 0, +1 );
    dampVertical( w, w.getWidth() - 1, -1 );
    dampVerticalContinuous( lattice, 0, +1, dampY / 2 );
    dampVerticalContinuous( lattice, lattice.getWidth() - 1, -1, dampY / 2 );
    dampHorizontalContinuous( lattice, 0, +1, dampX / 2 );
    dampHorizontalContinuous( lattice, lattice.getHeight() - 1, -1, dampX / 2 );
  Copy back to smaller lattice

where:

     private void dampVerticalContinuous( Lattice2D lattice, int origin, int sign, int numDampPts ) {
         for ( int j = 0; j < lattice.getHeight(); j++ ) {
             for ( int step = 0; step < numDampPts; step++ ) {
                 int distFromDampBoundary = numDampPts - step;
                 float damp = getDamp( distFromDampBoundary );
                 int i = origin + step * sign;
                 lattice.setValue( i, j, lattice.getValue( i, j ) * damp );
                 getLast().setValue( i, j, getLast().getValue( i, j ) * damp );
             }
         }
     }

     private void dampHorizontalContinuous( Lattice2D lattice, int origin, int sign, int numDampPts ) {
         for ( int i = 0; i < lattice.getWidth(); i++ ) {
             for ( int step = 0; step < numDampPts; step++ ) {
                 int distFromDampBoundary = numDampPts - step;
                 float damp = getDamp( distFromDampBoundary );
                 int j = origin + step * sign;
                 lattice.setValue( i, j, lattice.getValue( i, j ) * damp );
                 getLast().setValue( i, j, getLast().getValue( i, j ) * damp );
             }
         }
     }

    private void dampHorizontal( Lattice2D lattice2D, int j, int dj ) {
        for ( int i = 0; i < lattice2D.getWidth(); i++ ) {
            lattice2D.setValue( i, j, last2.getValue( i, j + dj ) );
        }
    }

    private void dampVertical( Lattice2D lattice2D, int i, int di ) {
        for ( int j = 0; j < lattice2D.getHeight(); j++ ) {
            lattice2D.setValue( i, j, last2.getValue( i + di, j ) );
        }
    }
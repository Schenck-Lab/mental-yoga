// manifestNets.js
// -----------------------------------------------------------------------------
// Enumerates all concrete cube-net variants ("manifest nets") derived from
// primitive nets by applying legal (flip, rotNum) transformations.
//
// Concepts
// --------
// Primitive Net (pnet):
//   - Base 8×8 matrix with a stable system key (netKey)
//   - May or may not support flip variants
//
// Manifest Net (mnet):
//   - A fully specified variant of a primitive net
//   - Identified by a compressed manifestKey: "netKey.f.2" or "netKey.2"
//   - Carries derived outputMatrix plus minimal metadata for lookup / display
//
// Interface Design
// ----------------
// This module exposes a *compressed registry*:
//   - All legal manifest nets are pre-enumerated
//   - App code never constructs nets from parameter tuples
//   - Interaction is via manifestKey enumeration + lookup
//
// Registries
// ----------
//   - CUBE_MNETS     : nets that fold into a cube
//   - NON_CUBE_MNETS : nets that do not fold into a cube
//
// Keys of each registry serve as the stable, app-facing identifiers.
// -----------------------------------------------------------------------------

import { MATRIX_DIM, CUBE_PNETS, NON_CUBE_PNETS } from './primitiveNets.js';


function makeManifestKey(netKey, flip, rotNum) {
    return flip ? `${netKey}.f.${rotNum}` : `${netKey}.${rotNum}`;
}


function makeDisplayLabel(netKey, flip, rotNum) {
    return makeManifestKey(netKey, flip, rotNum);
}


function computeOutputMatrix(baseMatrix, flip, rotNum) {
    const N = MATRIX_DIM;
    const END = N - 1;

    // flip first (mirror horizontally)
    const temp = baseMatrix.map((row) => (
        flip ? row.slice().reverse() : row.slice())
    );

    const getIndice = (i, j) => ([
        [i,j],
        [j, END - i],
        [END - i, END - j],
        [END - j, i]
    ][rotNum]);
    
    const out = Array.from({ length: N }, () => Array(N).fill(0));

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const [x, y] = getIndice(i, j);
            out[i][j] = temp[x][y];
        }
    }
    return out;
}


function buildManifestMap(pnets, isValid) {
    const map = Object.create(null);
    const ROT_NUMBERS = [0, 1, 2, 3];

    for (const pnet of pnets) {
        const FLIPS = pnet.isFlippable ? [false, true] : [false];

        for (const flip of FLIPS) {
            for (const rotNum of ROT_NUMBERS) {
                const manifestKey = makeManifestKey(pnet.netKey, flip, rotNum);

                if (map[manifestKey] !== undefined) {
                    throw new Error(`Duplicate manifestKey detected: '${manifestKey}'`);
                }
                const obj = Object.freeze({
                    manifestKey,
                    netKey: pnet.netKey,
                    flip,
                    rotNum,
                    isValid,
                    outputMatrix: computeOutputMatrix(pnet.mat, flip, rotNum),
                    displayLabel: makeDisplayLabel(pnet.netKey, flip, rotNum),
                });
                map[manifestKey] = obj;
            }
        }
    }
    return Object.freeze(map);
}

// Registries (system cache)
export const CUBE_MNETS = buildManifestMap(CUBE_PNETS, true);
export const NON_CUBE_MNETS = buildManifestMap(NON_CUBE_PNETS, false);

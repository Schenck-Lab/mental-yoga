// src/_experiment/questionLibrary.js
import { CUBE_ID } from '../scene/cubeCharacters';
import { HALF_UNIT } from '../cubenet/cubeThreeModel';


const p0 = [0,HALF_UNIT,0];
const p1 = [0,HALF_UNIT + 1,0];
const p2 = [0,HALF_UNIT + 1.5,0];

export const EXPERIMENT_PROBBLEM_SET = [
    // level-1
    [
        [
            {cubeId: CUBE_ID.COOKIE, mnetKey: 'cross.0', t100: 0, visible: true, baseId: 2 }, 
            {cubeId: CUBE_ID.CEEKIO, mnetKey: null,      t100: 0, visible: false }, 
        ],
        [
            {cubeId: CUBE_ID.COOKIE, mnetKey: 'bone.f.1',  t100: 0, visible: true, baseId: 2 }, 
            {cubeId: CUBE_ID.CEEKIO, mnetKey: null,        t100: 0, visible: false },
        ],
        [
            {cubeId: CUBE_ID.CEEKIO, mnetKey: 'waterfall.0', t100: 0, visible: true, baseId: 2 }, 
            {cubeId: CUBE_ID.COOKIE, mnetKey: null,         t100: 0, visible: false},
        ],
        [
            {cubeId: CUBE_ID.COOKIE, mnetKey: 'ring-spanner.f.2', t100: 0, visible: true, baseId: 2 }, 
            {cubeId: CUBE_ID.CEEKIO, mnetKey: null, t100: 0, visible: false},
        ],
        [
            {cubeId: CUBE_ID.COOKIE, mnetKey: 'snake.f.1', t100: 0, visible: true, baseId: 2 }, 
            {cubeId: CUBE_ID.CEEKIO, mnetKey: null,        t100: 0, visible: false},
        ],
        [
            {cubeId: CUBE_ID.CEEKIO, mnetKey: 'diving-board.2', t100: 0, visible: true, baseId: 2 }, 
            {cubeId: CUBE_ID.COOKIE, mnetKey: null,             t100: 0, visible: false},
        ],
        [
            {cubeId: CUBE_ID.CEEKIO, mnetKey: 'river.f.3', t100: 0, visible: true, baseId: 2 }, 
            {cubeId: CUBE_ID.COOKIE, mnetKey: null,        t100: 0, visible: false},
        ],
        [
            {cubeId: CUBE_ID.COOKIE, mnetKey: 'seahorse-2.3',  t100: 0, visible: true, baseId: 1 }, 
            {cubeId: CUBE_ID.CEEKIO, mnetKey: null,            t100: 0, visible: false},
        ],
    ],
    // level-2
    [
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'cross.1', baseId: 3, t100: 0, visible: true, givenLabel: 'L'}],
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'bone.0', baseId: 4, t100: 0, visible: true, givenLabel: 'L'}],
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'pipe-wrench.1', baseId: 2, t100: 0, visible: true, givenLabel: 'L'}],
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'ring-spanner.1', baseId: 2, t100: 0, visible: true, givenLabel: 'L'}],
        
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'seahorse-1.0', baseId: 2, t100: 0, visible: true, givenLabel: 'L'}],
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'seahorse-2.1', baseId: 2, t100: 0, visible: true, givenLabel: 'L'}],
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'snake.0', baseId: 2, t100: 0, visible: true, givenLabel: 'L'}],
        [{cubeId: CUBE_ID.CHICKEN, mnetKey: 'stairs.0', baseId: 3, t100: 0, visible: true, givenLabel: 'L'}],
    ],
    // level-3
    [
        [{cubeId: CUBE_ID.PIPE, mnetKey: 'cross.1', baseId: 1, t100: 0, visible: true, givenLabel: 'TR'}],
        [{cubeId: CUBE_ID.PIPE, mnetKey: 'seahorse-1.0', baseId: 1, t100: 0, visible: true, givenLabel: 'TB'}],
        [{cubeId: CUBE_ID.PIPE, mnetKey: 'snake.1', baseId: 1, t100: 0, visible: true, givenLabel: 'DR'}],
        [{cubeId: CUBE_ID.PIPE, mnetKey: 'stairs.3', baseId: 1, t100: 0, visible: true, givenLabel: 'TR'}],

        [{cubeId: CUBE_ID.PIPE, mnetKey: 'pipe-wrench.0', baseId: 1, t100: 0, visible: true, givenLabel: 'BL'}],
        [{cubeId: CUBE_ID.PIPE, mnetKey: 'ring-spanner.2', baseId: 1, t100: 0, visible: true, givenLabel: 'FR'}],
        [{cubeId: CUBE_ID.PIPE, mnetKey: 'seahorse-3.1', baseId: 1, t100: 0, visible: true, givenLabel: 'DR'}],
        [{cubeId: CUBE_ID.PIPE, mnetKey: 'pickaxe.1', baseId: 1, t100: 0, visible: true, givenLabel: 'DL'}],
    ],
    // level-4
    [
        [{cubeId: CUBE_ID.OGRE, mnetKey: 'cross.1', baseId: 1, t100: 0, visible: true, givenLabel: 'TRF'}],
        [{cubeId: CUBE_ID.OGRE, mnetKey: 'seahorse-1.2', baseId: 1, t100: 0, visible: true, givenLabel: 'FRD'}],
        [{cubeId: CUBE_ID.OGRE, mnetKey: 'stairs.1', baseId: 1, t100: 0, visible: true, givenLabel: 'TBR'}],
        [{cubeId: CUBE_ID.OGRE, mnetKey: 'seahorse-3.2', baseId: 1, t100: 0, visible: true, givenLabel: 'TLB'}],

        [{cubeId: CUBE_ID.OGRE, mnetKey: 'snake.3', baseId: 1, t100: 0, visible: true, givenLabel: 'LBT'}],
        [{cubeId: CUBE_ID.OGRE, mnetKey: 'stairs.1', baseId: 1, t100: 0, visible: true, givenLabel: 'TRF'}],
        [{cubeId: CUBE_ID.OGRE, mnetKey: 'pipe-wrench.1', baseId: 1, t100: 0, visible: true, givenLabel: 'LDB'}],
        [{cubeId: CUBE_ID.OGRE, mnetKey: 'ring-spanner.3', baseId: 1, t100: 0, visible: true, givenLabel: 'LBT'}],
    ],
    // level-5
    [
        [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'seahorse-2.1', baseId: 1, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'seahorse-2.1', baseId: 1, initPose: 'TF', t100: 100 , position: p2},
        ],
        [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'pickaxe.0', baseId: 2, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'pickaxe.0', baseId: 2, initPose: 'TF', t100: 100 , position: p2},
        ],
        [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'pipe-wrench.2', baseId: 5, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'pipe-wrench.2', baseId: 5, initPose: 'TF', t100: 100 , position: p2},
        ],
        [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'stairs.f.2', baseId: 4, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'stairs.f.2', baseId: 4, initPose: 'TF', t100: 100 , position: p2},
        ],

        [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'snake.0', baseId: 4, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'snake.0', baseId: 4, initPose: 'TF', t100: 100 , position: p2},
        ],
        [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'bone.0', baseId: 1, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'bone.0', baseId: 1, initPose: 'TF', t100: 100 , position: p2},
        ],
        [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'pliers.2', baseId: 1, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'pliers.2', baseId: 1, initPose: 'TF', t100: 100 , position: p2},
        ],
         [
            {cubeId: CUBE_ID.ICEBOX, mnetKey: 'seahorse-3.1', baseId: 5, t100: 0, position: p0},
            {cubeId: CUBE_ID.ICEBOX_STATIC, mnetKey: 'seahorse-3.1', baseId: 5, initPose: 'TF', t100: 100 , position: p2},
        ],
    ],

    // level-6
    [   
        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'pickaxe.0', baseId: 3, initPose: 'TF', t100: 100 , position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'pickaxe.0', baseId: 3, initPose: 'TR', t100: 0, position: p0, is_static: true},
        ],
        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'stairs.2', baseId: 2, initPose: 'TF', t100: 100, position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'stairs.2', baseId: 2, initPose: 'RT', t100: 0, position: p0, is_static: true},
        ],
        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'pipe-wrench.2', baseId: 3, initPose: 'TF', t100: 100 , position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'pipe-wrench.2', baseId: 3, initPose: 'TL', t100: 0, position: p0, is_static: true},
        ],
        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'pliers.2', baseId: 3, initPose: 'TF', t100: 100 , position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'pliers.2', baseId: 3, initPose: 'FR', t100: 0, position: p0, is_static: true},
        ],
        

        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'ring-spanner.1', baseId: 4, initPose: 'TF', t100: 100 , position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'ring-spanner.1', baseId: 4, initPose: 'FD', t100: 0, position: p0, is_static: true},
        ],
        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'snake.3', baseId: 3, initPose: 'TF', t100: 100 , position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'snake.3', baseId: 3, initPose: 'RB', t100: 0, position: p0, is_static: true},
        ],
        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'cross.1', baseId: 1, initPose: 'TF', t100: 100 , position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'cross.1', baseId: 1, initPose: 'FT', t100: 0, position: p0, is_static: true},
        ],
        [
            {cubeId: CUBE_ID.EVILEYE, mnetKey: 'seahorse-1.1', baseId: 1, initPose: 'TF', t100: 100 , position: p1},
            {cubeId: CUBE_ID.EVILEYE_STATIC, mnetKey: 'seahorse-1.1', baseId: 1, initPose: 'TB', t100: 0, position: p0, is_static: true},
        ],
    ],
];


 
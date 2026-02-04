import { CUBE_ID } from './cubeCharacters';
import { HALF_UNIT } from '../cubenet/cubeThreeModel';

export const LEVEL_SPEC = Object.freeze({
    0: [CUBE_ID.COOKIE],
    1: [CUBE_ID.COOKIE],
    2: [CUBE_ID.CHICKEN],
    3: [CUBE_ID.PIPE],
    4: [CUBE_ID.OGRE],
    5: [CUBE_ID.ICEBOX],//[CUBE_ID.ICEBOX, CUBE_ID.ICEBOX_STATIC,],
    6: [CUBE_ID.EVILEYE, CUBE_ID.EVILEYE_STATIC],
});


export const CUBE_LEVEL_INIT = {
    [CUBE_ID.COOKIE]:         {pos:[0,HALF_UNIT,0], t100: 100},
    [CUBE_ID.CHICKEN]:        {pos:[0,HALF_UNIT,0], t100: 0},
    [CUBE_ID.PIPE]:           {pos:[0,HALF_UNIT,0], t100: 50},
    [CUBE_ID.OGRE]:           {pos:[0,HALF_UNIT,0], t100: 100},
    [CUBE_ID.ICEBOX]:         {pos:[0,HALF_UNIT,0], t100: 100},
    [CUBE_ID.ICEBOX_STATIC]:  {pos:[0,HALF_UNIT,0], t100: 100},
    [CUBE_ID.EVILEYE]:        {pos:[-1,HALF_UNIT,-1], t100: 0},
    [CUBE_ID.EVILEYE_STATIC]: {pos:[1,HALF_UNIT,1], t100: 100},
};


export const LEVEL_ACTIVE_CUBEID_MAP = Object.freeze({
    1: CUBE_ID.COOKIE,
    2: CUBE_ID.CHICKEN,
    3: CUBE_ID.PIPE,
    4: CUBE_ID.OGRE,
    5: CUBE_ID.ICEBOX,
    6: CUBE_ID.EVILEYE,
});

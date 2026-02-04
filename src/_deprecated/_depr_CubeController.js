// import { Quaternion } from 'three';
// import * as THREE from 'three';
// import { CUBE_MNETS } from './manifestNets';
// import { easeCubicInOut, easeSinInOut } from 'd3-ease';
// import { NEW_VERTICES, HOVER_MAT, SELECT_MAT, FACE_HOV_MAT, FACE_SEL_MAT, FACE_CACHE, OGRE_MAT, POP_MAT } from '../scene/MatList';
// import { FACE_LOCAL_FRAME_MAP, FACE_XZ_NEIGHBOR_MAP, CUBE_ORIENTATION_MAP } from './cubeSpec';
// import { ANIMATION_MODE } from './cubeThreeModel';
// import { CHILD_FACE_ATTACH_OFFSET, CHILD_FACE_ATTACH_ROTNUM, HINGE_ROTATION_SPEC, HALF_UNIT, HALF_PI } from './cubeThreeModel';
// import { FACE_LABEL } from './cubeSpec';
// import { CUBE_ID } from '../scene/cubeCharacters';



// // ----------------------------------------- //
// /**  
//  *   |-$ attachFaceRig
//  *   |
//  *   |-$ updateAnimation
//  *       |---------------------------------------$ checkRigRefs
//  *       |   |-$ initCube
//  *       |       |-2 assemblyFaces
//  *       |       |-------------------------------$ setManifestMatrix
//  *       |       |                                 |-2 resetTimeParameters
//  *       |       |-------------------------------$ setBaseId
//  *       |       |-------------------------------$ setAnimationMode
//  *       |    
//  *       |---------------------------------------$ applyRotation
//  *       |---------------------------------------$ computeHierarchyGuide
//  *       |---------------------------------------$ rebuildMeshHierarchy
//  *       |                                         |-$ deconstructMeshHierarchy
//  *       |                                         |-2 assemblyFaces
//  *       |   
//  *       |---------------------------------------? updateT100FromDelta  
//  *       |---------------------------------------$ updateCubeNetTransformation
//  *                                                 |-$ computeTValues

//  * 
//  *   (public)                      (multi-inner)                (single-inner)
//  *   |-- setPosition               |-2 assemblyFaces            |-- setManifestMatrix
//  *   |-- resetToCube               |-- resetTimeParameters      |-- setBaseId
//  *   |-- rotateTo                  |--                          |-- setAnimationMode
//  *   |-- rotate                                                 |-- applyRotation
//  *   |-- resetToCubeLocked                                      |
//  *   |   |-2 resetTimeParameters                                |-- deconstructMeshHierarchy
//  *   |-- setAutoPlay                                            |-- updateT100FromDelta
//  *   |-- setSliderRef                                           |-- updateCubeNetTransformation
//  *   |-- attachSliderRef                                        |-- computeTValues
//  * 
//  */

// // ----------------------------------------- //

// const MNETS_KEY = Object.keys(CUBE_MNETS);

// // reset
// // stage -> target_status

// export default class CubeController {

//     // Constructor and Instance methods
//     constructor(cubeId='cookie') {
//         // Cube id check
//         if (!Object.values(CUBE_ID).includes(cubeId)) {
//             throw new Error(`Invalid cubeId: ${cubeId}`);
//         }
//         this.cubeId = cubeId;

//         // status
//         this.init = false;
//         this.rigRefsReady = false;

//         // Rig refs
//         this.root = undefined;
//         this.rigSlots = ['face', 'xp', 'xn', 'zp', 'zn'];
//         this.faceRigs = Object.fromEntries(
//             Object.values(FACE_LABEL).map(fLabel => [fLabel, {}])
//         );



//         // ---------------------------------------Rotation fields
//         this.isRotating = false;
//         this.currPose = 'TF';
//         this.nextPose = 'TF';
//         this.t = 1;  // time parameter for rotation animation

//         this.quaternion = new Quaternion();
//         this.initSpeed = 0;
//         this.ACC = 0.5;
//         this.currSpeed = this.initSpeed;
//         this.easeFn = (t) => (t);  // ease function for rotation

        
//         // -------------------------Cube-net transformation fields
//         this.meshDirty = false;
//         this.manifestMatrix = null;
//         this.baseId = 0;
//             this.faceIndices = null;
//             this.hierMatrix = null;
//             this.guide = null;

//         this.animationMode = ANIMATION_MODE.BLOSSOM;
//         this.t100 = 100;
//         this.p200 = 100;
//         this.tValues = [1,1,1,1,1];
        
//         this.sliderRef = null;
//         this.isAutoPlay = false;
        

//         /** -------------------------Interaction Management Unit */
//         // Face, edge, vertex fields
//         this.interactorFlag = {
//             face: this.cubeId === 'chicken',
//             edge: false,
//             vertex: this.cubeId === 'ogre',
//             rocket: false,
//         };
//         this.faces = {};
//         this.edges = Object.fromEntries(
//             Object.keys(CUBE_ORIENTATION_MAP).map(key => [key, null])
//         );
//         this.vertices = {};

//         this.hover = {
//             face: null,
//             edge: null,
//             vertex: null,
//         };

//         this.selected = {
//             fSet: new Set(),
//             eSet: new Set(),
//             vSet: new Set(),
//         };
//     }

//     // public
//     attachFaceRig(label, refs) {
//         this.faceRigs[label] = refs;
//     }

//     /**
//      * 1. 
//      * 2. 
//      */
//     #assembleRawCube(faceLabelList) {
//         const h = HALF_UNIT;
//         const p = Math.PI;
//         const q = p * 0.5;

//         const pos = {
//             T: [0,+h,0],
//             D: [0,-h,0],
//             F: [0,0,+h],
//             B: [0,0,-h],
//             L: [-h,0,0],
//             R: [+h,0,0],
//         };

//         const rot = {
//             T: [-p,0,0],
//             D: [0,0,0],
//             F: [-q,0,0],
//             B: [q,0,0],
//             L: [0,0,-q],
//             R: [0,0,+q],   
//         };

//         faceLabelList.forEach(f => {
//             this.faceRigs[f].face.current.position.set(...pos[f]);
//             this.faceRigs[f].face.current.rotation.set(...rot[f]);
//         });
//     }

//     initCube() {
//         // Raise the cube up half unit and assmebly the faces
//         this.root.current.position.set(0, HALF_UNIT, 0);
//         this.#assembleRawCube(Object.keys(FACE_LABEL));
        
//         // Set default values for cube net
//         this.setManifestMatrix(CUBE_MNETS[MNETS_KEY[0]].outputMatrix);
//         this.setBaseId(0);
        
//         // Set default time parameters
//         this.setAnimationMode(ANIMATION_MODE.BLOSSOM);
//         this.tValues = [1,1,1,1,1];
//         this.t100 = 100;

//         // Set init and dirty flags
//         this.init = true;
//         this.meshDirty = true;

//         console.log('[Cube Init: done]');
//     }

//     checkRigRefs() {
//         this.rigRefsReady = this.root && Object.keys(FACE_LABEL).every(f => {
//             const currFace = this.faceRigs[f];
//             return this.rigSlots.every(e => currFace[e]);
//         });

//         if (!this.rigRefsReady) {
//             console.warn('[Loading rig refs...]');
//             return;
//         }
//         console.log('[Ref Check Passed]');
//         //this.initCube();
//     };

//     setPosition(pos) {
//         if (!this.root) return;
//         this.root.current.position.set(...pos);
//     }

//     resetToCube() {
//         this.rotateTo('TF');
//     }

//     rotateTo(rotationKey) {
//         if (this.isRotating) {
//             return;
//         }
//         if (!CUBE_ORIENTATION_MAP.hasOwnProperty(rotationKey)) {
//             throw new Error(`Invalid rotation key: '${rotationKey}'`);
//         }
//         this.nextPose = rotationKey;
//         this.t = 0;
//         this.isRotating = true;
//         this.meshDirty = true;
//     }

//     rotate(op) {
//         if (this.isRotating) {
//             return;
//         }
//         this.nextPose = CUBE_ORIENTATION_MAP[this.nextPose][op];
//         this.t = 0;
//         this.isRotating = true;
//         this.meshDirty = true;
//     }

//     resetTimeParameters(value=0) {
//         this.t100 = value;
//         this.p200 = value;
//         if (this.sliderRef && this.sliderRef.current) {
//             this.sliderRef.current.value = value;
//         }
//     }

//     resetToCubeLocked() {
//         this.resetTimeParameters(100);
//         this.isAutoPlay = false;
//     }

//     setManifestMatrix(matrix) {
//         const getFacesCoordinate = () => {
//             const list = [];
//             for (let r = 0; r < 8; ++r) {
//                 for (let c = 0; c < 8; ++c) {
//                     if (this.manifestMatrix[r][c] === 1) {
//                         list.push({rid: r, cid: c});
//                     }
//                 }
//             }
//             return list;
//         }
//         this.manifestMatrix = matrix;
//         this.faceIndices = getFacesCoordinate();
//         this.meshDirty = true;
//         this.resetTimeParameters(100);
//     }

//     setBaseId(baseId) {
//         this.baseId = baseId;
//         this.meshDirty = true;
//         this.resetTimeParameters(100);
//     }

//     setAnimationMode(mode) {
//         this.animationMode = mode;
//         this.meshDirty = true;
//         this.resetTimeParameters(100);
//         if (this.sliderRef && this.sliderRef.current) {
//             this.sliderRef.current.value = 100;
//         }
//     }

//     setAutoPlay(flag) {
//         if (flag) {
//             this.p200 = this.t100;
//         }
//         this.isAutoPlay = flag;
//     }

//     attachSliderRef(sliderRef) {
//         if (sliderRef && (this.sliderRef !== sliderRef)) {
//             this.sliderRef = sliderRef;
//             console.log('CubeController: new sliderRef received.');
//         }
//     }


//     applyRotation(delta) {
//         // rotation sentinel
//         if (!this.isRotating) {
//             return;
//         }
//         this.currSpeed += this.ACC;
//         this.t += delta * this.currSpeed;
        
//         const qaData = CUBE_ORIENTATION_MAP[this.currPose].qtn;
//         const qbData = CUBE_ORIENTATION_MAP[this.nextPose].qtn

//         const qa = new THREE.Quaternion(...qaData);
//         const qb = new THREE.Quaternion(...qbData);
//         const qm = new THREE.Quaternion();

//         // Finsih rotation
//         if (this.t >= 1) {
//             this.root.current.quaternion.copy(qb);
//             this.t = 1;
//             this.isRotating = false;
//             this.currPose = this.nextPose;
//             this.currSpeed = this.initSpeed;
//             return;
//         }

//         // Process rotation for current frame
//         const easedT = this.easeFn(this.t);
//         qm.slerpQuaternions(qa, qb, easedT);
//         this.root.current.quaternion.copy(qm);
//     }


//     updateAnimation(delta) {
//         // Guard: Refs check and cube init
//         if (!this.rigRefsReady) {
//             this.checkRigRefs();
//             return;
//         }
//         if (!this.init) {
//             this.initCube();
//             return;
//         }

//         // Animation logic
//         if (this.isRotating) {
//             this.applyRotation(delta);
//         }
//         else if (this.meshDirty) {
//             this.computeHierarchyGuide();
//             this.rebuildMeshHierarchy();
//             this.meshDirty = false;
//         } 
//         else {
//             if (this.isAutoPlay) {
//                 this.updateT100FromDelta(delta);
//                 if (this.sliderRef && this.sliderRef.current) {
//                     this.sliderRef.current.value = this.t100;
//                 }
//             }
//             if (this.guide) {
//                 this.updateCubeNetTransformation();
//             }
//         }
//     }

    
//     /**
//      * Computes the hierarchical structure and relative rotations of cube net faces
//      * starting from a base face. It traverses the outline matrix recursively to:
//      * 
//      * 1. Build a labeled hierarchy matrix (`hierMatrix`) where each face is marked
//      *    with its label and rotation number.
//      * 2. Generate an assembly guide (`guide`) recording parent-child relationships
//      *    and rotation (in radians) needed to align each face with its parent.
//      */
//     computeHierarchyGuide() {
//         // Init hierarchy matrix and assembly guide
//         const hierMatrix = this.manifestMatrix.map(row => 
//             row.map(cell => (cell === 1 ? 'xx' : '__'))
//         );
//         const guide = [];

//         // Define a dfs helper
//         function dfs(pKey, currFace, r, c) {
//             if (r < 0 || r === 8 || c < 0 || c === 8) {
//                 return;  // Out of bound
//             }
//             if (hierMatrix[r][c] !== 'xx') {
//                 return;  // Visited
//             }
//             // add a piece of record to the guide
//             hierMatrix[r][c] = currFace;
//             const cKey = currFace[0];
//             const rNum = Number(currFace[1]);

//             if (pKey) {
//                 const edge = FACE_LOCAL_FRAME_MAP[pKey][cKey];
//                 const rotation = CHILD_FACE_ATTACH_ROTNUM[pKey][cKey];
//                 const position = CHILD_FACE_ATTACH_OFFSET[edge];
//                 guide.push({ 
//                     pKey, cKey, edge, rotation, position 
//                 });
//             }
            
//             // Process child-nodes recursively 
//             const list = FACE_XZ_NEIGHBOR_MAP[cKey][rNum];
//             dfs(cKey, list[0], r, c + 1);
//             dfs(cKey, list[1], r - 1, c);
//             dfs(cKey, list[2], r, c - 1);
//             dfs(cKey, list[3], r + 1, c);
//         }
        
//         // Add base face to matrix
//         const baseFace = CUBE_ORIENTATION_MAP[this.currPose].base
//         const {rid, cid} = this.faceIndices[this.baseId];

//         // Call dfs to update hierMatrix and guide
//         dfs(null, baseFace, rid, cid);
//         this.hierMatrix = hierMatrix;
//         this.guide = guide;
//     }
    
    
//     // Detaches and resets all face transforms except for the base face ('down').
//     deconstructMeshHierarchy() {
//         // eslint-disable-next-line
//         for (const [key, face] of Object.entries(this.faceRigs)) {
//             const group = face.face?.current;
//             if (!group) {
//                 continue;
//             }
//             if (group.parent) {
//                 group.parent.remove(group); // Remove from scene graph
//             }
//             group.position.set(0, 0, 0);
//             group.rotation.set(0, 0, 0);
//         }
//     }
    
    
//     /**
//      * Rebuilds the cube face hierarchy based on the provided assembly guide.
//      */
//     rebuildMeshHierarchy() {
//         if (!this.faceRigs || !this.guide) {
//             return;
//         }
//         this.deconstructMeshHierarchy();
        
//         // handle base face
//         const baseFace = CUBE_ORIENTATION_MAP[this.currPose].base;
//         const baseKey = baseFace[0];
//         const baseGroup = this.faceRigs[baseKey].face.current;
//         this.root.current.add(baseGroup);
//         this.#assembleRawCube([baseKey]);
        
//         // Rebuild the hierarchy based on the guide
//         this.guide.forEach(({ pKey, cKey, rotation, position, edge }, i) => {
            
//             // Get the parent and child objects
//             const parentEdgeGroup = this.faceRigs[pKey][cKey].current;
//             const childGroup = this.faceRigs[cKey].face.current;
    
//             if (!parentEdgeGroup || !childGroup) {
//                 console.warn(`Failed to rebind ${cKey} to ${pKey}.`);
//                 return;
//             }
//             // Attach to parent and adjust child transformation
//             parentEdgeGroup.add(childGroup);
//             childGroup.position.set(...position);
//             childGroup.rotation.set(0, rotation * HALF_PI, 0);

//             const { axis, limitRad } = HINGE_ROTATION_SPEC[edge];
//             const edgeGroup = this.faceRigs[pKey][cKey].current;
//             edgeGroup.rotation[axis] = this.tValues[i] * limitRad;
//         });

//         console.log('[Mesh Hierarchy Rebuild: done]');
//     }
    
//     updateT100FromDelta(delta) {
//         const speed = 20;
//         const MAX_PROGRESS = 200;

//         this.p200 += delta * speed;
//         if (this.p200 >= MAX_PROGRESS) {
//             this.p200 -= MAX_PROGRESS;
//         }
//         this.t100 = Math.min(this.p200, MAX_PROGRESS - this.p200);
//     }
    
//     /** Animation update function */
//     updateCubeNetTransformation() {
        
//         // Compute a list of 5 normalized t-values
//         this.tValues = this.computeTValues();

//         for (let i = 0; i < 5; ++i) {
//             // access guide record
//             const { pKey, cKey, edge } = this.guide[i];
//             const { axis, limitRad } = HINGE_ROTATION_SPEC[edge];

//             // perform rotation on edges in guide note
//             const edgeGroup = this.faceRigs[pKey][cKey].current;
//             edgeGroup.rotation[axis] = this.tValues[i] * limitRad;
//         }
//     }
    
//     // Compute t values for each animation mode
//     computeTValues() {
//         const EDGE_NUM = 5;
//         if (this.animationMode === ANIMATION_MODE.BLOSSOM) {
//             const t = this.t100 / 100;
//             const easeT = easeSinInOut(t)
//             return Array(EDGE_NUM).fill(easeT);
//         }

//         const tValues = Array(EDGE_NUM).fill(0);
//         let temp = this.t100;
//         for (let i = 0; i < EDGE_NUM; ++i) {
//             if (temp <= 0) {
//                 break;
//             }
//             tValues[i] = Math.min(temp / 20, 1);
//             if (this.animationMode !== ANIMATION_MODE.BLOSSOM) {
//                 tValues[i] = easeCubicInOut(tValues[i]);
//             }
//             temp -= 20;
//         }
    
//         if (this.animationMode === ANIMATION_MODE.WAVING) {
//             return tValues;
//         }
//         if (this.animationMode === ANIMATION_MODE.ROLLING) {
//             return tValues.reverse();
//         }
//         return Array(EDGE_NUM).fill(1);
//     }

//     inCubeMode() {
//         return this.t100 === 100 && !this.isAutoPlay;
//     }



//     // ===================================== Interaction Management Methods //

//     // Vertex events
//     handleVertexHover(vid, flag, faceLabel) {
//         const vertex = this.vertices[vid]?.current;
//         if (!vertex) return;

//         // Hover out: restore cached material
//         if (flag === 1) {
//             vertex.material = HOVER_MAT;
//             return;
//         }
//         const selected = this.selected.vSet.has(vid);
//         const mat = {
//             coach: NEW_VERTICES[faceLabel],
//             ogre: OGRE_MAT.bodyV.new,
//         }[this.cubeId];
//         vertex.material = selected ? SELECT_MAT : mat;
//     }

//     handleVertexClick(vid, faceLabel) {
//         const vertex = this.vertices[vid]?.current;
//         if (!vertex) return;

//         const mat = {
//             coach: NEW_VERTICES[faceLabel],
//             ogre: OGRE_MAT.bodyV.new,
//         }[this.cubeId];

//         if (this.selected.vSet.has(vid)) {
//             vertex.material = mat;
//             vertex.scale.set(1, 1, 1);
//             this.selected.vSet.delete(vid);
//         }
//         else {
//             vertex.material = SELECT_MAT;
//             vertex.scale.set(1.1, 1.2, 1.1);
//             this.selected.vSet.add(vid);
//         }
//     }

//     // Edge events
//     handleEdgeHover(eid, flag, faceLabel) {
//         const edge = this.edges[eid]?.current; // pipeRef.current
//         if (!edge) return;

//         // Decide which material to apply
//         let newMat;
//         if (flag === 1) {
//             newMat = HOVER_MAT;
//         } else {
//             const selected = this.selected.eSet.has(eid);
//             newMat = selected
//                 ? SELECT_MAT
//                 : {
//                     coach: NEW_VERTICES[faceLabel],
//                     pipeline: POP_MAT.pipe.new,
//                 }[this.cubeId];
//         }

//         // Traverse the group's children & update their materials
//         edge.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = newMat;
//             }
//         });
//     }

//     handleEdgeClick(eid, faceLabel) {
//         const edge = this.edges[eid]?.current; // group ref
//         if (!edge) return;

//         const mat = {
//             coach: NEW_VERTICES[faceLabel],
//             pipeline: POP_MAT.pipe.new,
//         }[this.cubeId];

//         let newMat;

//         if (this.selected.eSet.has(eid)) {
//             // Deselect
//             newMat = mat;
//             this.selected.eSet.delete(eid);
//         } else {
//             // Select
//             newMat = SELECT_MAT;
//             this.selected.eSet.add(eid);
//         }

//         // Apply the new material to all mesh children
//         edge.traverse((child) => {
//             if (child.isMesh) {
//                 child.material = newMat;
//             }
//         });
//     }


//     // Face events
//     handleFaceHover(fid, flag) {
//         const face = this.faces[fid]?.current;
//         if (!face) return;

//         // Hover out: restore cached material
//         if (flag === 1) {
//             face.material = FACE_HOV_MAT;
//             return;
//         }
//         const selected = this.selected.fSet.has(fid);
//         face.material = selected ? FACE_SEL_MAT : FACE_CACHE;
//         face.scale.set(1, 1, (selected) ? 2.05: 1);
//     }

//     handleFaceClick(fid) {
//         const face = this.faces[fid]?.current;
//         if (!face) return;

//         if (this.selected.fSet.has(fid)) {
//             console.log(`vid: ${fid}`);
//             face.material = FACE_CACHE;
//             face.scale.set(1, 1, 1);
//             this.selected.fSet.delete(fid);
//         }
//         else {
//             face.material = FACE_SEL_MAT;
//             face.scale.set(1, 1, 2.05);
//             this.selected.fSet.add(fid);
//         }
//     }
// }
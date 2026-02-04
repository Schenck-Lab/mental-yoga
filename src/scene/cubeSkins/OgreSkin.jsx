import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { useThree, useFrame } from '@react-three/fiber';
import { SIMPLE_MAT, OGRE_MAT } from '../MatList';
import { HALF_UNIT } from '../../cubenet/cubeThreeModel';
import SinTimer from '../../utils/SinTimer';
import VertexSkin from './VertexSkin';
import { 
    sphere_mesh, cyl_mesh, buffer_mesh, 
    box_mesh, indices_4_to_3, cap_mesh } from '../meshLib';

extend({ TextGeometry });

// Global constants
const h = HALF_UNIT;
const p = Math.PI;
const q = 0.5 * p;

// Return a list of points in 4 quadrants
function get4Pts(pts) {
    const temp = [...pts];
    temp.push(...temp.map(v => [-v[0], v[1], v[2]]));
    temp.push(...temp.map(v => [v[0], v[1], -v[2]]));
    return temp;
}

// Force the ref object to look at the camera
function lookAtCamera(camera, headRef) {
    if (!headRef.current || !camera) {
        return;
    }
    const head = headRef.current;
    const parent = head.parent;
    if (!parent) return;

    // 1. Get camera position in world space
    const camWorldPos = new THREE.Vector3();
    camera.getWorldPosition(camWorldPos);

    // 2. Convert camera position to the local space of the parent of the head
    const camPosInParent = camWorldPos.clone().applyMatrix4(
        new THREE.Matrix4().copy(parent.matrixWorld).invert()
    );

    // 3. Get head's position in the same parent space
    const headPos = new THREE.Vector3();
    head.getWorldPosition(headPos);

    const parentInverseMatrix = new THREE.Matrix4()
                                         .copy(parent.matrixWorld)
                                         .invert();

    // Transform head position into parent's local space
    headPos.applyMatrix4(parentInverseMatrix);

    // 4. Direction from head to camera (in parent space)
    const dir = new THREE.Vector3().subVectors(camPosInParent, headPos);

    // 5. Compute yaw (Y) and pitch (X)
    let yaw = Math.atan2(dir.x, dir.z);
    let pitch = Math.atan2(dir.y, Math.sqrt(dir.x * dir.x + dir.z * dir.z));

    const minYaw = THREE.MathUtils.degToRad(-70);
    const maxYaw = THREE.MathUtils.degToRad(70);

    if (yaw <= maxYaw && yaw >= minYaw) {
        yaw = (yaw >= 0) ? maxYaw : minYaw;
    }
    const minPitch = THREE.MathUtils.degToRad(-60);
    const maxPitch = THREE.MathUtils.degToRad(30);
    pitch = THREE.MathUtils.clamp(pitch, minPitch, maxPitch);

    // 7. Apply rotation, locking Z
    head.rotation.set(-pitch, yaw, 0, 'YXZ');
}


function FaceLabelTextMesh({ label }) {
    const meshRef = useRef();
    const text = {
        D: '', 
        T: '',
        F: 'Sneak',
        B: 'Shh',
        L: 'Loot',
        R: 'Hide', 
    };
    // Z-axis rotation (in radians) to orient face label text
    const rotTable = {
        D: [q,0,0],
        T: [q,0,0],
        F: [q,0,0],
        B: [q,0,p],
        L: [q,0,q],
        R: [q,0,-q],
    };

    const posY = {
        D: 0,
        T: 0,
        F: 0,
        B: 0,
        L: 0,
        R: 0,
    };
    // Load font once
    const options = {
        font: useLoader(FontLoader, './assets/droid_sans_bold.typeface.json'),
        size: 1,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5
    };

    useEffect(() => {
        if (meshRef.current) {
            // Compute bouding box to place the text in center of the face
            const geometry = meshRef.current.geometry;
            geometry.computeBoundingBox();

            const box = geometry.boundingBox;
            const xOffset = (box.max.x + box.min.x) / 2;
            const yOffset = (box.max.y + box.min.y) / 2;

            geometry.translate(-xOffset, -yOffset + posY[label], 0.16);
        }
    // eslint-disable-next-line
    });

    const s = 0.135;
    return (
        <group rotation={rotTable[label]}>
            <mesh ref={meshRef} 
                position={[0,0,-0.02]} 
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {SIMPLE_MAT.label}
            </mesh>
        </group>
    );
}


function BasicFace({label}) {
    const interpPoints = (a, b, v) => {
        return [
            a[0] + (b[0] - a[0]) * v,
            a[1] + (b[1] - a[1]) * v,
            a[2] + (b[2] - a[2]) * v,
        ];
    }
    const cut = h * 0.3;
    const m = interpPoints(
        [h, 0, h],
        [-h, h * 2, -h],
        cut / 3
    );
    const vertices = [
        [h - cut, 0, h], [h, 0, h - cut], m,
    ];
    vertices.push(...vertices.map(p => [-p[0], p[1], +p[2]]));
    vertices.push(...vertices.map(p => [+p[0], p[1], -p[2]]));
    
    const indices = [
        0,1,2, 0,7,1, 0,6,7, 7,6,8, 0,3,6,
        3,5,4, 4,10,9, 3,4,9, 10,11,9, 3,9,6,
        2,5,11, 2,11,8,
        0,3,5, 0,5,2, 4,10,11, 4,11,5,
        1,2,8, 8,7,1, 11,9,8, 8,9,6,
    ];
    return (
        <group
            userData={{id: label}}
            rotation={[q,0,0]}
            onPointerOver={(e) => {e.stopPropagation()}}
            onPointerOut={(e) => {e.stopPropagation()}}
            onClick={(e) => {e.stopPropagation()}}
        >
            {buffer_mesh(vertices.flat(), indices, 
                OGRE_MAT.body.tag, [0,0,0], [-q,0,0])
            }
        </group>);
};

///////////////////////////////////////////////////////////////////////////////
// Skin Components                                                           
//-----------------------------------------------------------------------------

function Head({cubeId}) {
    const { camera } = useThree();
    const singleEye = useRef();
    const headRRef = useRef();
    const headLRef = useRef();
    const knotRef = useRef();
    const eyeTimer  = useRef(new SinTimer(2));
    const knotTimer = useRef(new SinTimer(0.5));
    const headFollow = useRef(true);

    /* Temp test code */
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'f') {
                headFollow.current = !headFollow.current;
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line
    }, []);

    // Handle local animation
    useFrame((_, delta) => {
        // Single eye moves up and down
        if (singleEye.current) {
            const sinVal = eyeTimer.current.getOutput(delta);
            singleEye.current.rotation.x = sinVal * (0.25 * p);
        }
        // Topknot swaying in the wind
        if (knotRef.current) {
            const sinVal = knotTimer.current.getOutput(delta);
            knotRef.current.rotation.z = sinVal * (0.1 * p);
        }
        // Heads face to camera
        if (headFollow.current) {
            lookAtCamera(camera, headLRef);
            lookAtCamera(camera, headRRef);
        } else {
            headLRef.current.rotation.set(0,p,0);
            headRRef.current.rotation.set(0,p,0);
        }
    });

    // head.ears
    const ears = () => {
        const z = 0.01;
        const y = -0.025;
        const w = -0.08;
        const x = 0.04;

        const ptsR = [
            [0,0,-z], [x-0.01,y,0], [x,y+w,0],
            [0,w,-z], [0,0,+z], [0,w,+z]
        ];
        const ptsL = ptsR.map(v => [-v[0], v[1], v[2]]);

        const idx = [0,1,4, 3,2,5, 0,1,2, 0,2,3, 4,1,5, 5,1,2];
        const mat = OGRE_MAT.body.tag;
        
        return (
            <group>
                {buffer_mesh(ptsL.flat(), idx, mat, [-0.1,-0.14,0])}
                {buffer_mesh(ptsR.flat(), idx, mat, [+0.1,-0.14,0])}
            </group>
        );
    };

    // head.tusks
    const tusks = () => {
        const x = 0.015;
        const y = -0.03;
        const w = 0.01;
        const dx = 0.01;
        const dz = -0.02;

        const ptsR = [
            [dx-w,y,dz+w], [dx+w,y,dz+w], [dx+w,y+0.01,dz-w], [dx-w,y,dz-w],
            [+0.02, -0.07, -0.02],
            [-x,0,x],[x,0,x],[x,0,-x],[-x,0,-x],
        ];
        const ptsL = ptsR.map(v => [-v[0], v[1], v[2]]);

        const idx = [
            0,1,3, 1,3,2, 4,0,1, 4,1,2, 4,2,3, 4,3,0,
            ...indices_4_to_3([
                1,0,5,6, 0,3,8,5, 2,3,8,7, 1,2,7,6,
            ]),
        ];
        const mat = OGRE_MAT.tusk.tag;

        return (
            <group>
                {buffer_mesh(ptsR.flat(), idx, mat, [+0.05,-0.1,-0.1])}
                {buffer_mesh(ptsL.flat(), idx, mat, [-0.05,-0.1,-0.1])}
            </group>
        );
    };

     // head.eye
    const eye = () => {
        const eyeW = 0.017;
        const eyeL = 0.035;
        return (
            <group ref={singleEye} position={[0,-0.21,-0.1]} rotation={[0,0,q]}>
                {cap_mesh(OGRE_MAT.eye.tag, eyeW, eyeL)}
                {sphere_mesh(OGRE_MAT.hair.tag, [0.008], [0,0,-eyeW], [0,0,0], [1,1,0.2])}
            </group>
        );
    };

    // head.eyes
    const eyes = () => {
        const eyeBall = sphere_mesh(OGRE_MAT.hair.tag, 
            [0.01], [0,0,-0.015], [0,0,0], [1/1.8,1,1]
        );
        const pos = (sign) => [(sign * 0.03), -0.21, -0.1];
        const rot = (sign) => [0, 0, (sign * q * 0.25)]
        const scale = [1.3,0.6,0.6];

        return (
            <group>
                <group position={pos(+1)} rotation={rot(-1)} scale={scale}>
                    {sphere_mesh(OGRE_MAT.eye.tag, [0.017])}
                    {eyeBall}
                </group>
                <group position={pos(-1)} rotation={rot(+1)} scale={scale}>
                    {sphere_mesh(OGRE_MAT.eye.tag, [0.017])}
                    {eyeBall}
                </group>
            </group>
        );
    };

    // head.horn
    const horn = () => {
        const x =  0.025;
        const y = -0.08;
        const w =  0.02;
        const z = -0.05;

        const pts = [
            [-w,y,w+z], [w,y,w+z], [w,y+0.02,-w+z], [-w,y+0.02,-w+z],
            [0, -0.16, -0.06],
            [-x,0,x],[x,0,x],[x,0,-x],[-x,0,-x],
        ];

        const idx = [
            0,1,3, 1,3,2, 4,0,1, 4,1,2, 4,2,3, 4,3,0,
            ...indices_4_to_3([
                1,0,5,6, 0,3,8,5, 2,3,8,7, 1,2,7,6,
            ]),
        ];
        const mat = OGRE_MAT.tusk.tag;

        return (
            <group>
                {buffer_mesh(pts.flat(), idx, mat, [0,-0.26,-0.07])}
            </group>
        );
    };

    // head.knot
    const knot = () => {
        const size = 0.1;
        const mat = OGRE_MAT.hair.tag;
        return (
            <group>
                {cyl_mesh(OGRE_MAT.belt.tag, [0.022,0.022,0.06], [0,-0.33,0])}
                {/* knot */}
                <group ref={knotRef} position={[0,-0.38,0]}>
                    {sphere_mesh(mat, [0.035])}
                    {cyl_mesh(mat, [0.025,0,size], [size * 0.7,0,0], [0,0,q])}
                </group>
            </group>
        );
    };

    // head.neck
    const neck = () => {
        const ht = 0.04;
        const r = 0.04;
        const mat = OGRE_MAT.bodyS.tag;
        return (
            <group>
                {cyl_mesh(mat, [1.8*r,r,ht,12], [0, 0.02-(0.5*ht), 0])}
                {sphere_mesh(mat, [r, 12], [0,-0.02,0])}
            </group>
        );
    };

    // head.all
    const head = (sign) => {
        const a = [0.04, -0.3, 0.05];
        const b = [0.04, -0.25, 0.1];
        const c = [0.1, -0.25, 0.05];
        const d = [0.04, -0.02, 0.05]; // bottom a
        
        const rawHead = () => {
            const base = (y) => get4Pts([[b[0], y, b[2]], [c[0], y, c[2]]]);
            const idxB = [
                9,8,16,17, 9,5,13,17, 5,4,12,13, 4,6,14,12,
                7,6,14,15, 11,7,15,19, 11,10,18,19, 10,8,16,18
            ];
            const idx8 = (i) => indices_4_to_3(idxB.map(v => v - 4 + i)); 

            const mouth = base(-0.10);
            mouth[4][2] -= 0.03;
            mouth[6][2] -= 0.03;
            mouth[5][2] -= 0.01;
            mouth[7][2] -= 0.01;

            const chin = base(-0.05);
            chin[4][2] -= 0.03;
            chin[6][2] -= 0.03;
            chin[4][0] += 0.01;
            chin[6][0] -= 0.01;
            chin[5][2] -= 0.005;
            chin[7][2] -= 0.005;

            const pts = [
                ...get4Pts([a]),
                ...base(-0.25),
                ...base(-0.12),
                ...mouth,
                ...chin,
                ...get4Pts([d]),
            ];
            const idx = [
                8,2,9, 0,4,5, 11,3,10, 7,6,1,
                28,29,36, 38,32,33, 39,35,34, 30,31,37,
                ...idx8(4),
                ...idx8(12),
                ...idx8(20),
                ...indices_4_to_3([
                    0,1,3,2, 10,3,2,8, 9,2,0,5, 1,6,4,0, 11,7,1,3,
                    36,29,33,38, 39,38,32,34, 37,39,35,31, 30,28,36,37,
                    36,38,39,37,
                ]),
            ];

            return (
                <group position={[sign * 0.15,0,0]}>
                    {/* head skin */}
                    <group ref={sign === -1 ? headLRef : headRRef}>
                        <group rotation={[p,0,p]}>
                            {buffer_mesh(pts.flat(), idx, OGRE_MAT.body.tag)}
                            {ears()}
                            {tusks()}
                            {sign === -1 ? eyes() : eye()}
                            {sign === -1 ? horn() : knot()}
                        </group>
                    </group>
                    {neck()}
                </group>
            );
        };
        
        const s = 1.35;
        return (
            <group position={[0,-0.02,0]} scale={[s,s,s]}>
                {rawHead()}
            </group>
        );
    };

    return (
        <group>
            <BasicFace label='T' />
            <FaceLabelTextMesh label='T' />
            {head(-1) /* L-head, double eyes with horn */}
            {head(+1) /* R-head, single eys with topknot */}
        </group>
    );
}


function Legs() {
    const x = 0.1;
    const y = -0.12;
    const z = 0.12;
    const w = 0.06; // length of ankle

    const leg = (posX) => {
        const cut = h * 0.3;
        const pts = get4Pts([
            [h * 0.5 - cut, 0, h * 0.6], 
            [h * 0.5, 0, (h - cut) * 0.5], 
            [x, y, z]
        ]);
        const idx = [
            0,2,1, 3,4,5, 11,10,9, 8,6,7,
            ...indices_4_to_3([
                0,3,5,2, 4,10,11,5, 11,9,6,8, 1,2,8,7,
            ]),
        ];

        const matLeg = OGRE_MAT.body.tag;
        const matAnkle = OGRE_MAT.tusk.tag;

        return (
            <group>
                {buffer_mesh(pts.flat(), idx, matLeg, [posX,0,0])}
                {box_mesh(matAnkle, [x*2, w, z*2], [posX, y-(0.5*w), 0])}
            </group>
        );
    };

    const foot = (posX) => {
        const cy = -0.25;
        const anklePts = get4Pts([[x, y - w, z]]);
        const shoe = [
            [0.12,cy,0.35],[0.2,cy,0.15],[0.15,cy,0],[0.15,cy,-0.15],[0.05,cy,-0.25],
        ];
        shoe.push(...shoe.map(v => [-v[0], v[1], v[2]]));
        const btm = shoe.map(v => [v[0], v[1]-0.1, v[2]]);
        const pts = [...anklePts, ...shoe, ...btm];

        const idx = [
            4,0,5, 5,0,6, 0,2,6, 6,2,7, 2,8,7,
            9,10,1, 10,11,1, 1,11,3, 11,3,12, 3,12,13,
            9,1,0, 4,9,0, 3,13,2, 2,13,8,
            ...indices_4_to_3([
                4,5,15,14, 5,6,16,15, 6,7,17,16, 7,8,18,17, 8,13,23,18,
                4,9,19,14, 9,10,20,19, 10,11,21,20, 11,12,22,21, 12,13,23,22,
                // bottom
                14,15,20,19, 15,16,21,20, 21,16,17,22, 22,17,18,23,
            ]),
        ];
        return (
            <group>
                {buffer_mesh(pts.flat(), idx, OGRE_MAT.body.tag, [posX,0,0])}
            </group>
        );
    };

    return (
        <group>
            <BasicFace label='D' />
            <FaceLabelTextMesh label='D' />
            {leg(-0.25)}
            {leg(+0.25)}
            {foot(-0.25)}
            {foot(+0.25)}
        </group>
    );
}


function Front() {
    return (
        <group>
            <BasicFace label='F' />
            <FaceLabelTextMesh label='F' />
        </group>
    );
}


function Back() {
    return (
        <group>
            <BasicFace label='B' />
            <FaceLabelTextMesh label='B' />
        </group>
    );
}


function Arm({label}) {
    const ref_s = useRef();
    const ref_e = useRef();
    const ref_w = useRef();
    const ref_p = useRef();
    const ref_s_node = useRef();
    const ref_e_node = useRef();
    const timerLE = useRef(new SinTimer(1.5));
    const handRef = useRef(
        Array.from({ length: 5 }, () =>
            Array.from({ length: 3 }, () => React.createRef())
        )
    );
    const waveHand = useRef(false);
    
    /* Temp test code */
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'w' && label === 'L') {
                waveHand.current = !waveHand.current;
            }
            if (event.key === 'r' && label === 'R') {
                waveHand.current = !waveHand.current;
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line
    }, []);

    const allHandRefsReady = () => handRef.current.flat()
                                                  .every(ref => ref.current);
    
    const raiseArm = (label) => {
        const sign = {'L': +1, 'R': -1}[label];

        ref_s.current.rotation.order = 'YZX';
        ref_s.current.rotation.y = p * 1;
        ref_s.current.rotation.z = sign * p * -0.2;
    };
    
    const idleHand = (label) => {
        const sign = {'L': +1, 'R': -1}[label];
        const sp = sign * p;

        handRef.current[0][0].current.rotation.order = 'XZY';
        handRef.current[0][0].current.rotation.z = sp * -0.1;
        handRef.current[0][0].current.rotation.y = sp * -0.1;
        handRef.current[0][1].current.rotation.y = sp * 0.1;
        handRef.current[0][2].current.rotation.y = sp * 0.1;

        for (let fid = 1; fid < 5; ++fid) {
            handRef.current[fid].forEach(part => {
                part.current.rotation.y = sp * (0.05 + fid * 0.03);
            });
        }
    };

    const naturalPalm = (label) => {
        const sign = {'L': +1, 'R': -1}[label];
        const sp = sign * p;

        handRef.current[0][0].current.rotation.order = 'XZY';
        handRef.current[0][0].current.rotation.z = 0;
        handRef.current[0][0].current.rotation.y = sign * p * -0.2;
        handRef.current[0][1].current.rotation.y = sign * p * 0.1;
        handRef.current[0][2].current.rotation.y = sign * p * 0.1;

        for (let fid = 1; fid < 5; ++fid) {
            handRef.current[fid].forEach(part => {
                part.current.rotation.y = sp * (0.01 + fid * 0.03);
            });
        }
    };

    const wavingArm = (label, delta) => {
        raiseArm(label);
        naturalPalm(label);
        
        ref_e.current.rotation.order = 'XZY';
        
        const sign = {'L': +1, 'R': -1}[label];
        const sp = sign * p;
        const value = timerLE.current.getOutput(delta);

        ref_s.current.rotation.z      = sp * (-0.225 + value * 0.050);
        ref_s_node.current.rotation.z = sp * (-0.060 - value * 0.035);
        ref_e.current.rotation.z      = sp * ( 0.200 + value * 0.150);
        ref_e_node.current.rotation.z = sp * ( 0.075 + value * 0.075);
        ref_p.current.rotation.z      = sp * ( 0.050 + value * 0.050);
    }
    
    const idleArm = (label) => {
        const sign = {'L': 1, 'R': -1}[label];
        const sp = sign * p;
        
        ref_s.current.rotation.order = 'YZX';
        ref_s.current.rotation.y      = 0;
        ref_s.current.rotation.z      = sp * -0.12;
        ref_s_node.current.rotation.z = 0;
        
        ref_e.current.rotation.order = 'XZY';
        ref_e.current.rotation.z      = sp * +0.17;
        ref_e_node.current.rotation.z = sp * 0.085;
        ref_p.current.rotation.z      = sp * -0.03;

        idleHand(label);
    }

    //
    useFrame((_, delta) => {
        if (!ref_s.current || !ref_e.current || 
            !ref_w.current || !ref_p.current) {
            return;
        }

        if (allHandRefsReady()) {
            if (waveHand.current) {
                wavingArm(label, delta);
            } else {
                idleArm(label);
            }
        }
    });

    const sign = {'L': -1, 'R': 1}[label];

    const wrist = () => {
        // wrist.phalanx
        const phalanx = (pid, isThumb=false) => {
            const posX = (index, arr) => arr.slice(0, index).reduce(
                (acc, h) => acc + h, arr[index] * 0.5
            );
            const ht = [
                [0.015, 0.045, 0.015],
                [0.010, 0.040, 0.010],
                [0.005, 0.025, 0.005],
            ];
            if (isThumb) {
                ht[0][1] = 0.065;
                ht[1][1] = 0.05;
            }
            const wd = [
                [0.005, 0.025, 0.023, 0.005],
                [0.005, 0.023, 0.020, 0.005],
                [0.005, 0.018, 0.015, 0.005],
            ];

            const part = (i) => cyl_mesh(OGRE_MAT.body.tag, 
                [wd[pid][0+i], wd[pid][1+i], ht[pid][0+i], 6], 
                [posX(i, ht[pid]), 0, 0], 
                [0,0,q]
            );

            return (
                <group rotation={[(p/6), 0, (sign === -1) ? 0 : p]}>
                    {part(0)} 
                    {part(1)} 
                    {part(2)}
                </group>
            );
        };

        // wrist.finger
        const finger = (fid) => {
            const posY = [0, 0.09, 0.03, -0.03, -0.09];
            const jointRef = handRef.current[fid];
            const jointPos = [
                [-0.15 * sign, posY[fid], 0.012],
                [-0.07 * sign, 0, 0],
                [-0.06 * sign, 0, 0],
            ];

            return (
                /* mac_joint */
                <group ref={jointRef[0]} position={jointPos[0]}>
                    {sphere_mesh(OGRE_MAT.tusk.tag, [0.015,9,6])}
                    {phalanx(0)}

                    {/* pip_joint */}
                    <group ref={jointRef[1]} position={jointPos[1]}>
                        {sphere_mesh(OGRE_MAT.tusk.tag, [0.012,9,6])}
                        {phalanx(1)}

                        {/* dip_joint */}
                        <group ref={jointRef[2]} position={jointPos[2]}>
                            {sphere_mesh(OGRE_MAT.tusk.tag, [0.01,9,6])}
                            {phalanx(2)}
                        </group>

                    </group>
                </group>
            );
        };

        // wrist.thumb
        const thumb = () => {
            const jointRef = handRef.current[0];
            const jointPos = [
                [-sign*0.04,0.08,0],
                [sign * -0.09,0,0],
                [sign * -0.07,0,0]
            ];

            return (
                <group position={jointPos[0]} rotation={[p*-0.4, 0, -p*0.2*sign]}>
                    {/* mac_joint */}
                    <group ref={jointRef[0]}> 
                        {sphere_mesh(OGRE_MAT.body.tag, [0.032,6,3])}
                        {phalanx(0, true)}

                        {/* pip_joint */}
                        <group ref={jointRef[1]} position={jointPos[1]}>
                            {sphere_mesh(OGRE_MAT.tusk.tag, [0.012,9,6])}
                            {phalanx(1, true)}

                            {/* dip_joint */}
                            <group ref={jointRef[2]} position={jointPos[2]}>
                                {sphere_mesh(OGRE_MAT.tusk.tag, [0.01,9,6])}
                                {phalanx(2, true)}
                            </group>

                        </group>
                    </group>
                </group>
            );
        };

        // wrist.palm
        const palm = () => {
            const x0 = -0.04;
            const x1 = -0.11;
            const z0 = 0.04;
            const z1 = 0.15;
            const y = 0.01;

            const pts = [
                [x0 * sign, y, 0], 
                [x1 * sign * 0.9, y, z0], 
                [x1 * sign, y, z1],
            ];
            pts.push(...pts.map(v => [-v[0], v[1], v[2]]));
            pts.push(...pts.map(v => [v[0], -v[1], v[2]]));

            pts[1][1] += 0.025;
            pts[4][1] += 0.025;
            pts[2][1] += 0.025;
            pts[5][1] += 0.025;
            pts[7][1] -= 0.025;

            const idx = indices_4_to_3([
                0,3,4,1, 1,4,5,2, 6,7,10,9, 7,8,11,10,
                0,3,9,6, 0,1,7,6, 1,2,8,7, 2,5,11,8, 4,5,11,10, 3,4,10,9,
            ]);
            const mat = OGRE_MAT.body.tag;
            return (
                <group ref={ref_p}>
                    {/* palm skin */}
                    {buffer_mesh(pts.flat(), idx, mat, [0,0,0], [q,-sign*q,0])}
                    
                    {/* fingers */}
                    {thumb()}
                    {finger(1)}
                    {finger(2)}
                    {finger(3)}
                    {finger(4)}
                </group>
            );
        };

        return (
            <group ref={ref_w} position={[-0.4 * sign,0,0]}>
                {palm()}
                {/* wrist skin */}
                {sphere_mesh(OGRE_MAT.belt.tag, [0.05,9,6])}
            </group>
        );
    };

    const elbow = () => {
        const ht = [0.08, 0.20, 0.1];
        const seqR = [0.04, 0.12, 0.10, 0.06];

        const posX = (index) => ht.slice(0, index).reduce(
            (acc, h) => acc + h, ht[index] * 0.5
        );
        const part = (i) => cyl_mesh(OGRE_MAT.body.tag, 
            [seqR[i], seqR[i+1], ht[i], 6], [posX(i),0,0], [0,0,q]
        );

        return (
            <group ref={ref_e} position={[-0.4 * sign,0,0]}>
                {wrist()}

                {/* front arm skin */}
                <group rotation={[p/6,0,sign === 1 ? p : 0]}>
                    {part(0)} 
                    {part(1)} 
                    {part(2)}
                </group>
            </group>
        );
    };

    const shoulder = () => {
        const ht = [0.05, 0.25, 0.11];
        const seqR = [0.04, 0.10, 0.12, 0.05];
        const posX = (index) => ht.slice(0, index).reduce(
            (acc, h) => acc + h, ht[index] * 0.5
        );
        const part = (i) => cyl_mesh(OGRE_MAT.body.tag, 
            [seqR[i],seqR[i+1],ht[i],6], [posX(i),0,0], [0,0,q]
        )

        return (
            // fixed shoulder base point
            <group position={[0.35 * sign,-0.1,0]}>
                {/* shoulder skin */}
                <group ref={ref_s_node}>
                    {sphere_mesh(OGRE_MAT.tusk.tag, [0.15, 6,3])}
                </group>

                {/* shoulder node */}
                <group ref={ref_s} >
                    {elbow()}

                    {/* upper arm skin */}
                    <group rotation={[p/6,0,sign === 1 ? p : 0]}>
                        {part(0)} 
                        {part(1)} 
                        {part(2)}
                    </group>

                    {/* elbow skin */}
                    <group ref={ref_e_node} position={[0.4 * -sign,0,0]} >
                        {sphere_mesh(OGRE_MAT.tusk.tag, [0.08,6,3])}
                    </group>
                    
                </group>
            </group>
        );
    };

    return (
        <group>
            <BasicFace label={label} />
            <FaceLabelTextMesh label={label} />
            {shoulder()}
        </group>
    );
}

///////////////////////////////////////////////////////////////////////////////
// Export Ogre Skin Map                                                           
//-----------------------------------------------------------------------------

const FACE_COMPONENT = {
    T: Head,
    D: Legs,
    F: Front,
    B: Back,
    L: Arm,
    R: Arm,
};

function VertexInteractorGroup({cubeId, label}) {
    return (
        <group>
            <VertexSkin cubeId={cubeId} label={label} ax0='xp' ax1='zn'/>
            <VertexSkin cubeId={cubeId} label={label} ax0='zn' ax1='xn'/>
            <VertexSkin cubeId={cubeId} label={label} ax0='xn' ax1='zp'/>
            <VertexSkin cubeId={cubeId} label={label} ax0='zp' ax1='xp'/>
        </group>
    );
}

export default function OgreSkin({ cubeId, label }) {
    const FaceSkin = FACE_COMPONENT[label];
    return (
        <group>
            <FaceSkin cubeId={cubeId} label={label} />
            <VertexInteractorGroup cubeId={cubeId} label={label} />
        </group>
    );
};

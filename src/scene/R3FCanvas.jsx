import React, { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { useAppContext } from '../context/AppContext';
import { Stage } from './Stage';
import { _render_shout_ } from '../utils/utils';


const CAMERA_DEFALUT_POS = [1.5, 4, 4.5];

function CameraControls() {
    const { camera, gl } = useThree();
    const { orbitControlsRef } = useAppContext();
    const isAnimating = useRef(false);
    const targetPosition = useRef(new THREE.Vector3(...CAMERA_DEFALUT_POS));
    const targetLookAt = new THREE.Vector3(0,0,0);
    const targetQuaternion = useRef(new THREE.Quaternion());

    useEffect(() => {
        const controls = orbitControlsRef.current;
        if (!controls) return;

        // Initial position and target
        camera.lookAt(0,0,0);
        controls.target.set(0,0,0);
        controls.saveState();

        // Precompute target quaternion
        const dummyCam = camera.clone();
        dummyCam.position.copy(targetPosition.current);
        dummyCam.lookAt(targetLookAt);
        targetQuaternion.current.copy(dummyCam.quaternion);

        controls.resetWithAnimation = () => {
            if (isAnimating.current) return; 
            isAnimating.current = true;
            controls.enabled = false; 
        };

        controls.resetInstant = () => {
            // 1) stop any running animation + unlock controls
            isAnimating.current = false;
            controls.enabled = true;

            // 2) snap camera + target
            camera.position.copy(targetPosition.current);
            controls.target.copy(targetLookAt);
            camera.lookAt(targetLookAt);

            // 3) make sure OrbitControls internal state is updated
            controls.update();
            controls.saveState();
        };

    // eslint-disable-next-line
    }, [camera, orbitControlsRef]);

    useFrame((_, delta) => {
        const controls = orbitControlsRef.current;
        if (!controls || !isAnimating.current) return;
    
        // Smoothly update camera.position and controls.target
        easing.damp3(camera.position, targetPosition.current, 0.3, delta);
        easing.damp3(controls.target, targetLookAt, 0.3, delta);
    
        controls.update();
    
        // Stop animating when both position and target are "close enough"
        if (
            camera.position.distanceTo(targetPosition.current) < 0.01 &&
            controls.target.distanceTo(targetLookAt) < 0.01
        ) {
            camera.position.copy(targetPosition.current);
            controls.target.copy(targetLookAt);
            controls.update(); // ensure OrbitControls knows

            isAnimating.current = false;
            controls.enabled = true;
            controls.saveState();
        }
    });
    
    return (
        <OrbitControls
            ref={orbitControlsRef}
            args={[camera, gl.domElement]}
            enableDamping
            dampingFactor={0.1}
        />
    );
}

function Env() {
    const presetList = [
        'apartment', // 0
        'city',      // 1
        'dawn',      // 2
        'forest',    // 3
        'lobby',     // 4
        'night',     // 5
        'park',      // 6
        'studio',    // 7
        'sunset',    // 8
        'warehouse'  // 9
    ];
    return <Environment preset={presetList[2]} 
        background backgroundBlurriness={0.9} />;
}

function GridAndGround({visible}) {
    const gridProps = {
        infiniteGrid: true, 
        cellSize: 1, 
        cellThickness: 0.5, 
        sectionSize: 3, 
        sectionThickness: 1.35, 
        sectionColor: [0.5, 0.5, 10], 
        fadeDistance: 30, 
        receiveShadow: true,
    };
    const meshPos = [0, -0.001, 0];
    const meshRot = [-Math.PI * 0.5, 0, 0];
    return (
        <group visible={visible} >
            <Grid {...gridProps} />
            <mesh position={meshPos} rotation={meshRot} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshBasicMaterial transparent />
                <shadowMaterial transparent opacity={0.4} />
            </mesh>
        </group>
    );
}

const R3FCanvas = React.memo(function R3FCanvas() {
    _render_shout_('R3FCanvas');
    
    const cameraProps = useMemo(
        () => ({ position: CAMERA_DEFALUT_POS, fov: 75 }),
        []
    );
    
    return (
        <Canvas dpr={[1, 2]} shadows camera={cameraProps}>
            {/* Environment */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 3, 3]} />
            <CameraControls />
            <Env />
            <GridAndGround visible={false} />
            {/* Game stage */}
            <Stage />
        </Canvas>
    );
});

export default R3FCanvas;
import { Geometry, Base, Subtraction } from '@react-three/csg';
import * as THREE from 'three';

export { 
    pi, box_mesh, sphere_mesh, cyl_mesh, extrude_mesh, buffer_mesh, 
    half_hexa_prism, bone_0_mesh, bone_1_mesh, pipe_mesh, ring_mesh,
    _sub_box, _sub_cyl, cap_mesh, torus_mesh, indices_4_to_3,
}

function pi(ratio=1) {
    return Math.PI * ratio;
}

function box_mesh(meshMat, geoArgs, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            <boxGeometry args={geoArgs} />
            {meshMat}
        </mesh>
    );
}

function sphere_mesh(meshMat, geoArgs, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            <sphereGeometry args={geoArgs} />
            {meshMat}
        </mesh>
    );
}

function cyl_mesh(meshMat, geoArgs, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            <cylinderGeometry args={geoArgs} />
            {meshMat}
        </mesh>
    );
}

function extrude_mesh(meshMat, shape, options, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            <extrudeGeometry args={[shape, options]} />
            {meshMat}
        </mesh>
    );
}

function buffer_mesh(vertList, indices, meshMat, meshPos, meshRot, meshScl, meshRef) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    const vertices = new Float32Array(vertList);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return (
        <mesh ref={meshRef} position={meshPos} rotation={meshRot} scale={meshScl}
            geometry={geometry} receiveShadow castShadow>
            {meshMat}
        </mesh>
    );
}

function half_hexa_prism(meshMat, geoArgs, corr=0, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    const seg = 6;
    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            {meshMat}
            <Geometry >
                <Base rotation={[0, pi(-1/seg), 0]}>
                    <cylinderGeometry args={[...geoArgs, seg, 1]}/>
                </Base>
                {_sub_box([1,1,1], [0,0,(0.5 + corr)])}
            </Geometry>
        </mesh>
    );
}


function cap_mesh(meshMat, r, h, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];
    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            <capsuleGeometry args={[r,h,24,24]} />
            {meshMat}
        </mesh>
    );
}


function bone_0_mesh(meshMat, r, length, thick, D, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    const width = 2 * r;
    const height = length;
    const y = length + r - D;
    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            {meshMat}
            <Geometry>
                <Base rotation={[0,pi(1/6),0]}>
                    <capsuleGeometry args={[r,length,12,12]} />
                </Base>
                {_sub_box([thick,height,width], [0,y,0])}
            </Geometry>
        </mesh>
    );
}

function bone_1_mesh(meshMat, r, length, thick, D, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    const geoArgs = [r, D, r * 2];
    const x = 0.5 * (r + thick);
    const y = 0.5 * (length - D) + r;
    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            {meshMat}
            <Geometry>
                <Base rotation={[0,pi(1/6),0]}>
                    <capsuleGeometry args={[r,length,12,12]} />
                </Base>
                {_sub_box(geoArgs, [-x,y,0])}
                {_sub_box(geoArgs, [+x,y,0])}
            </Geometry>
        </mesh>
    );
}

function pipe_mesh(meshMat, R, r, h, Rm=R, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            {meshMat}
            <Geometry >
                <Base><cylinderGeometry args={[Rm,R,h,24,1]} /></Base>
                {_sub_cyl([r,r,h,24,1])}
            </Geometry>
        </mesh>
    );
}

function ring_mesh(meshMat, R, r, thick, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    const s = R * 2;
    const x = R + thick * 0.5;
    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            {meshMat}
            <Geometry>
                <Base><sphereGeometry args={[R,24,24]}/></Base>
                {_sub_cyl([r,r,s,24,1], [0,0,0], [0,0,pi(0.5)])}
                {_sub_box([s,s,s], [+x,0,0])}
                {_sub_box([s,s,s], [-x,0,0])}
            </Geometry>
        </mesh>
    );
}

function torus_mesh(meshMat, r, t, meshPos, meshRot, meshScl) {
    meshPos = meshPos || [0,0,0];
    meshRot = meshRot || [0,0,0];
    meshScl = meshScl || [1,1,1];

    return (
        <mesh position={meshPos} rotation={meshRot} scale={meshScl} 
            castShadow receiveShadow>
            {meshMat}
            <torusGeometry args={[r, t, 12, 72]} />
        </mesh>
    );
}

function _sub_box(args, pos=[0,0,0], rot=[0,0,0]) {
    return (
        <Subtraction position={pos} rotation={rot}>
            <boxGeometry args={args} />
        </Subtraction>
    );
}

function _sub_cyl(args, pos=[0,0,0], rot=[0,0,0]) {
    return (
        <Subtraction position={pos} rotation={rot}>
            <cylinderGeometry args={args} />
        </Subtraction>
    );
}

function indices_4_to_3(input) {
    if (input.length % 4 !== 0) {
        throw new Error('Error: invalid input array length ', input.length);
    }
    const output = [];
    for (let i = 0; i < input.length; i += 4) {
        output.push(input[i], input[i + 1], input[i + 2]);
        output.push(input[i], input[i + 2], input[i + 3]);
    }
    return output;
}
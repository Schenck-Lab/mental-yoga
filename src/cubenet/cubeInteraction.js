// cubenet/cubeInteraction.js
import { CUBE_ID } from '../scene/cubeCharacters';
import {
    HOVER_MAT,
    SELECT_MAT,
    FACE_HOV_MAT,
    FACE_SEL_MAT,
    FACE_CACHE,
    OGRE_MAT,
    POP_MAT,
    ICEBOX_MAT,
} from '../scene/MatList';


export function createInteractor(ctrl) {
    switch (ctrl.cubeId) {
        case CUBE_ID.CHICKEN:
            return new FaceInteractor(ctrl);
        
        case CUBE_ID.PIPE:
            return new EdgeInteractor(ctrl);

        case CUBE_ID.OGRE:
            return new VertexInteractor(ctrl);

        case CUBE_ID.ICEBOX:
            return new IcecreamSelector(ctrl);
        
        default:
            return null;
    }
}

class FaceInteractor {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.faces = {};
        this.selected = new Set();
    }

    handleFaceHover(fid, flag) {
        const face = this.faces?.[fid]?.current;
        if (!face) return;

        if (flag === 1) {
            face.material = FACE_HOV_MAT;
            return;
        }
        const hasSelected = this.selected.has(fid);
        face.material = hasSelected ? FACE_SEL_MAT : FACE_CACHE;
    }

    handleFaceClick(fid) {
        const face = this.faces?.[fid]?.current;
        if (!face) return;

        if (this.selected.has(fid)) {
            face.material = FACE_CACHE;
            this.selected.delete(fid);
        } else {
            face.material = FACE_SEL_MAT;
            this.selected.add(fid);
        }
    }

    update() { }
}

class EdgeInteractor {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.edges = {};
        this.hoveredEid = null;
        this.selected = new Set();
    }

    #setGroupMat(group, mat) {
        group.traverse((child) => {
            if (child.isMesh) child.material = mat;
        });
    }

    // Edge
    handleEdgeHover(eid, flag) {
        const edge = this.edges?.[eid]?.current;
        if (!edge) return;

        let newMat;
        if (flag === 1) {
            newMat = HOVER_MAT;
        } else {
            const hasSelected = this.selected.has(eid);
            newMat = hasSelected ? SELECT_MAT : POP_MAT.pipe.new;
        }
        this.#setGroupMat(edge, newMat);
    }

    handleEdgeClick(eid) {
        const edge = this.edges?.[eid]?.current;
        if (!edge) return;

        const baseMat = POP_MAT.pipe.new;

        if (this.selected.has(eid)) {
            this.selected.delete(eid);
            this.#setGroupMat(edge, baseMat);
        } else {
            this.selected.add(eid);
            this.#setGroupMat(edge, SELECT_MAT);
        }
    }

    update() { }
}

class VertexInteractor {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.vertices = {};
        this.hoveredVid = null;
        this.selected = new Set();
    }

    handleVertexHover(vid, flag) {
        const vertex = this.vertices?.[vid]?.current;
        if (!vertex) return;
        if (flag === 1) {
            vertex.material = HOVER_MAT;
            return;
        }
        const hasSelected = this.selected.has(vid);
        const baseMat = OGRE_MAT.bodyV.new;
        vertex.material = hasSelected ? SELECT_MAT : baseMat;
    }

    handleVertexClick(vid) {
        const vertex = this.vertices?.[vid]?.current;
        if (!vertex) return;

        const baseMat = OGRE_MAT.bodyV.new;

        if (this.selected.has(vid)) {
            vertex.material = baseMat;
            vertex.scale.set(1, 1, 1);
            this.selected.delete(vid);
        } else {
            vertex.material = SELECT_MAT;
            vertex.scale.set(1.1, 1.2, 1.1);
            this.selected.add(vid);
        }
    }

    update() { }
}

class IcecreamSelector {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.selectorRefs = new Map(); // label -> { icRef, selRef }

        this.activeLabel = 'FT';
        this.hoverLabel = null;

        this.matIdle = ICEBOX_MAT.m3.new
        this.matHover = ICEBOX_MAT.hover.new
    }

    registerSelector(label, { icRef, selRef }) {
        this.selectorRefs.set(label, { icRef, selRef });
    }

    unregisterSelector(label) {
        this.selectorRefs.delete(label);
        if (this.activeLabel === label) this.activeLabel = null;
        if (this.hoverLabel === label) this.hoverLabel = null;
    }

    onHover(label) {
        this.hoverLabel = label;
    }

    onOut(label) {
        if (this.hoverLabel === label) this.hoverLabel = null;
    }

    onClick(label) {
        this.activeLabel = label;
    }

    update() {
        for (const [label, refs] of this.selectorRefs.entries()) {
            const ic = refs.icRef?.current;
            const sel = refs.selRef?.current;
            if (ic) {
                ic.visible = (label === this.activeLabel);
            }
            if (sel) {
                const isHover = (label === this.hoverLabel);
                sel.material = isHover ? this.matHover : this.matIdle;
            }
        }
    }
}

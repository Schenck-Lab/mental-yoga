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
        this.freeze = true;  // freeze all interaction operation
        this.givenLabel = null;
        this.selectedLabel = null;
    }

    setLock(flag) {
        if (flag === true) {
            this.freeze = true;
        }
        else if (flag === false) {
            this.freeze = false;
        }
    }

    #renderSelect(fid) {
        const face = this.faces?.[fid]?.current;
        if (!face) return;
        face.material = FACE_SEL_MAT;
        face.scale.set(1, 2.5, 1);
    }

    #renderHover(fid) {
        const face = this.faces?.[fid]?.current;
        if (!face) return;
        face.material = FACE_HOV_MAT;
        face.scale.set(1, 2.5, 1);
    }

    #renderDefault(fid) {
        const face = this.faces?.[fid]?.current;
        if (!face) return;
        face.material = FACE_CACHE;
        face.scale.set(1, 1, 1);
    }

    setGivenLabel(fid='L') {
        this.givenLabel = fid;
        this.#renderSelect(this.givenLabel);
    }

    clearActiveLabel() {
        this.#renderDefault(this.selectedLabel);
        this.selectedLabel = null;
    }

    clearAllLabels() {
        this.clearActiveLabel();
        this.#renderDefault(this.givenLabel);
        this.givenLabel = null;
    }

    handleFaceHover(fid, flag) {
        if (this.freeze) return;
        if (fid === this.givenLabel) return;

        if (flag === 1) {
            this.#renderHover(fid);
        }
        else if (fid === this.selectedLabel) {
            this.#renderSelect(fid);
        } 
        else {
            this.#renderDefault(fid);
        }
    }

    handleFaceClick(fid, addGameData, sys) {
        if (this.freeze) return;
        if (fid === this.givenLabel) return;

        if (fid === this.selectedLabel) {
            this.#renderDefault(fid);
            this.selectedLabel = null;
            addGameData(sys, fid, 'null');
        } 
        else {
            this.#renderDefault(this.selectedLabel);
            this.selectedLabel = fid;
            this.#renderSelect(this.selectedLabel)
            addGameData(sys, fid, fid);
        }
    }

    update() { }
}


class EdgeInteractor {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.edges = {};
        this.freeze = true;  // freeze all interaction operation
        this.givenLabel = null;
        this.selectedLabel = null;
    }

    #renderSelect(eid) {
        const edge = this.edges?.[eid]?.current;
        if (edge) {
            this.#setGroupMat(edge, SELECT_MAT);
        }
    }

    #renderHover(eid) {
        const edge = this.edges?.[eid]?.current;
        if (edge) {
            this.#setGroupMat(edge, HOVER_MAT);
        }
    }

    #renderDefault(eid) {
        const edge = this.edges?.[eid]?.current;
        if (edge) {
            this.#setGroupMat(edge, POP_MAT.pipe.new);
        }
    }

    #setGroupMat(group, mat) {
        group.traverse((child) => {
            if (child.isMesh) child.material = mat;
        });
    }

    setLock(flag) {
        if (flag === true) {
            this.freeze = true;
        }
        else if (flag === false) {
            this.freeze = false;
        }
    }

    setGivenLabel(eid='TF') {
        this.givenLabel = eid;
        this.#renderSelect(eid);
    }

    clearActiveLabel() {
        this.#renderDefault(this.selectedLabel);
        this.selectedLabel = null;
    }

    clearAllLabels() {
        this.clearActiveLabel();
        this.#renderDefault(this.givenLabel);
        this.givenLabel = null;
    }

    // Edge
    handleEdgeHover(eid, flag) {
        if (this.freeze) return;
        if (eid === this.givenLabel) return;

        if (flag === 1) {
            this.#renderHover(eid);
        } 
        else if (eid === this.selectedLabel) {
            this.#renderSelect(eid);
        }
        else {
            this.#renderDefault(eid);
        }
    }

    handleEdgeClick(eid, addGameData, sys) {
        if (this.freeze) return;
        if (eid === this.givenLabel) return;

        if (eid === this.selectedLabel) {
            this.#renderDefault(eid);
            this.selectedLabel = null;
            addGameData(sys, eid, 'null');
        } else {
            this.#renderDefault(this.selectedLabel);
            this.selectedLabel = eid;
            this.#renderSelect(this.selectedLabel);
            addGameData(sys, eid, eid);
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

        this.freeze = true;  // freeze all interaction operation
        this.givenLabel = null;
        this.selectedLabel = [null, null];
    }

    setLock(flag) {
        if (flag === true) {
            this.freeze = true;
        }
        else if (flag === false) {
            this.freeze  = false;
        }
    }

    setGivenLabel(vid='TFR') {
        this.givenLabel = vid;
        this.#renderSelect(vid);
    }

    clearActiveLabel() {
        if (this.selectedLabel) {
            const v0 = this.selectedLabel[0];
            const v1 = this.selectedLabel[1];
            
            if (v0) this.#renderDefault(v0);
            if (v1) this.#renderDefault(v1);
        }
        this.selectedLabel = [null, null];
    }

    clearAllLabels() {
        this.clearActiveLabel();
        if (this.givenLabel) {
            this.#renderDefault(this.givenLabel);
        }
        this.givenLabel = null;
    }

    #renderHover(vid) {
        const vertex = this.vertices?.[vid]?.current;
        if (!vertex) return;
        vertex.material = HOVER_MAT;
        vertex.scale.set(1, 1, 1);
    }

    #renderSelect(vid) {
        const vertex = this.vertices?.[vid]?.current;
        if (!vertex) return;
        vertex.material = SELECT_MAT;
        vertex.scale.set(1.1, 1.2, 1.1);
    }

    #renderDefault(vid) {
        const vertex = this.vertices?.[vid]?.current;
        if (!vertex) return;
        vertex.material = OGRE_MAT.bodyV.new;
        vertex.scale.set(1, 1, 1);
    }


    handleVertexHover(vid, flag) {
        if (this.freeze) return;
        if (vid === this.givenLabel) return;

        if (flag === 1) {
            this.#renderHover(vid);
        } else if (this.selectedLabel.includes(vid)) {
            this.#renderSelect(vid);
        } else {
            this.#renderDefault(vid);
        }
    }

    handleVertexClick(vid, addGameData, sys) {
        if (this.freeze) return;
        if (vid === this.givenLabel) return;

        const vertex = this.vertices?.[vid]?.current;
        if (!vertex) return;

        // [_,_] -> [a,_]
        if (this.selectedLabel[0] == null) {
            this.selectedLabel[0] = vid;
            this.#renderSelect(vid);
            addGameData(sys, vid, `${this.selectedLabel[0]}-${this.selectedLabel[1]}`);
        } 
        // [a,?] -> [?,_]
        else if (this.selectedLabel[0] == vid) {
            this.selectedLabel[0] = this.selectedLabel[1];
            this.selectedLabel[1] = null;
            addGameData(sys, vid, `${this.selectedLabel[0]}-${this.selectedLabel[1]}`);
        }
        // [a,_] -> [a,b]
        else if (this.selectedLabel[1] == null) {
            this.selectedLabel[1] = vid;
            addGameData(sys, vid, `${this.selectedLabel[0]}-${this.selectedLabel[1]}`);
        // [a,b] -> [a,_]
        } else if (this.selectedLabel[1] == vid) {
            this.selectedLabel[1] = null;
            addGameData(sys, vid, `${this.selectedLabel[0]}-${this.selectedLabel[1]}`);
        // [a,b] -> [b,c]
        } else {
            this.#renderDefault(this.selectedLabel[0]);
            this.selectedLabel[0] = this.selectedLabel[1];
            this.selectedLabel[1] = vid;
            addGameData(sys, vid, `${this.selectedLabel[0]}-${this.selectedLabel[1]}`);
        }
        //console.log(this.selectedLabel);
    }

    update() { }
}


class IcecreamSelector {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.selectionLock = false;
        this.selectorRefs = new Map(); // label -> { icRef, selRef }

        this.activeLabel = 'FT';
        this.hoverLabel = null;

        this.matIdle = ICEBOX_MAT.m3.new
        this.matHover = ICEBOX_MAT.hover.new
    }

    setLock(flag) {
        if (flag === true) {
            this.selectionLock = true;
            this.hoverLabel = null;
        }
        else if (flag === false) {
            this.selectionLock  = false;
        }
    }

    clearAllLabels() {
        this.clearActiveLabel();
    }

    clearActiveLabel() {
        this.activeLabel = null;
    }

    setActiveLabel(label) {
        this.activeLabel = label;
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

    onClick(label, addGameData, sys) {
        this.activeLabel = label;
        addGameData(sys, label, label);
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

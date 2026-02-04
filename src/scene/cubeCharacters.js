import * as Skin from './cubeSkins';

export const CUBE_ID = Object.freeze({
    COOKIE: 'cookie',
    CHICKEN: 'chicken',
    PIPE: 'pipe',
    OGRE: 'ogre',
    ICEBOX: 'icebox',
    ICEBOX_STATIC: 'icebox_static',
    EVILEYE: 'evileye',
    EVILEYE_STATIC: 'evileye_static',
});


export const SKIN_MAP = Object.freeze({
    cookie: Skin.CookieSkin,
    chicken: Skin.ChickenSkin,
    pipe: Skin.PipeSkin,
    ogre: Skin.OgreSkin,
    icebox: Skin.IceboxSkin,
    icebox_static: Skin.IceboxSkin,
    evileye: Skin.EvileyeSkin,
    evileye_static: Skin.EvileyeSkin,
});

const BlockActions = {
    DUPLICATE: 'duplicate',
    DELETE: 'delete',
    ROTATE: 'rotate',
    R_RESIZE: 'rresize',
    B_RESIZE: 'bresize',
    V_MOVE: 'vmove',
    H_MOVE: 'hmove',
    OPACITY: 'opacity',
    Z_INDEX: 'zindex',

    MAP_COLORS: 'block-map-colors',
    PREVENT_CLIPPING: 'block-prevent-clipping',

    ASSET_CUT_OUT: 'asset-cut-out',
    ASSET_REPLACE: 'asset-replace',
    ASSET_FILL_BLOCK: 'asset-fill-block',

    FONT: 'font',
    FONT_STYLE: 'font-style',
    FONT_FAMILY: 'font-family',
    FONT_DECORATION: 'font-decoration',
    FONT_SIZE: 'fontsize',
    COLOR: 'color',
    V_ALIGN: 'valign',
    H_ALIGN: 'halign',
    LIST: 'list',
    SCRIPT: 'script',
    H_SCALING: 'hscaling',
    TEXT_WRITE: 'text-write',

    RESIZE: [
        'tresize',
        'trresize',
        'rresize',
        'brresize',
        'bresize',
        'blresize',
        'lresize',
        'tlresize'
    ],

    MOVE: [
        'vmove',
        'hmove'
    ]
};

export default BlockActions;

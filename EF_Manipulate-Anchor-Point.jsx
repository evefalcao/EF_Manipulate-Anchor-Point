var resourceString = 
"group{orientation:'column', alignment: ['fill', 'fill'], alignChildren: ['left', 'top'],\
    anchorPointGroup: Panel{alignment: ['fill', 'fill'], text: 'Anchor Point',\
        row1: Group{orientation:'row',\
            a: RadioButton{},\
            b: RadioButton{},\
            c: RadioButton{},\
        },\
        row2: Group{orientation:'row',\
            a: RadioButton{},\
            b: RadioButton{},\
            c: RadioButton{},\
        },\
        row3: Group{orientation:'row',\
            a: RadioButton{},\
            b: RadioButton{},\
            c: RadioButton{},\
        },\
    },\
    offsetPositionGroup: Panel{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], text: 'Offset position',\
        xLabel: StaticText{text:'X'},\
        xText: EditText{text: '0', characters: 4},\
        yLabel: StaticText{text:'Y'},\
        yText: EditText{text: '0', characters: 4},\
        zLabel: StaticText{text:'Z'},\
        zText: EditText{text: '0', characters: 4}\
    },\
    extraActionGroup: Group{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center']\
        addNull: Checkbox{text: 'Add null'},\
        addExpression: Checkbox{text: 'Add expression'},\
    },\
    applyButton: Button{text: 'Apply', alignment: ['center', 'bottom']}\
}";

function createUserInterface(thisObj, userInterfaceString, scriptName){

    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable: true});
    if (pal == null) return pal;

    var UI = pal.add(userInterfaceString);

    pal.layout.layout(true);
    pal.layout.resize();
    pal.onResizing = pal.onResize = function () {
        this.layout.resize();
    }
    if ((pal != null) && (pal instanceof Window)) {
        pal.show();
    }

    return UI;
};

var UI = createUserInterface(this, resourceString, "EF_Manipulate Anchor Point");

UI.anchorPointGroup.row1.addEventListener("click", function () {
    for (var i = 0; i < UI.anchorPointGroup.row1.children.length; i++) {
        UI.anchorPointGroup.row2.children[i].value = false;
        UI.anchorPointGroup.row3.children[i].value = false;
    }
});
UI.anchorPointGroup.row2.addEventListener("click", function () {
    for (var i = 0; i < UI.anchorPointGroup.row2.children.length; i++) {
        UI.anchorPointGroup.row1.children[i].value = false;
        UI.anchorPointGroup.row3.children[i].value = false;
    }
});
UI.anchorPointGroup.row3.addEventListener("click", function () {
    for (var i = 0; i < UI.anchorPointGroup.row3.children.length; i++) {
        UI.anchorPointGroup.row1.children[i].value = false;
        UI.anchorPointGroup.row2.children[i].value = false;
    }
});

UI.offsetPositionGroup.xText.onChange = function(){
    var xVal = parseFloat(UI.offsetPositionGroup.xText.text);
    if(isNaN(xVal)){
        UI.offsetPositionGroup.xText.text = 0;
    }
}

UI.offsetPositionGroup.yText.onChange = function(){
    var yVal = parseFloat(UI.offsetPositionGroup.yText.text);
    if(isNaN(yVal)){
        UI.offsetPositionGroup.yText.text = 0;
    }
}

UI.offsetPositionGroup.zText.onChange = function(){
    var zVal = parseFloat(UI.offsetPositionGroup.zText.text);
    if(isNaN(zVal)){
        UI.offsetPositionGroup.zText.text = 0;
    }
}


// UI.applyButton.onClick = function(){};
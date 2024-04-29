var resourceString = 
"group{orientation:'column', alignment: ['fill', 'fill'], alignChildren: ['left', 'top'],\
    anchorPointGroup: Panel{alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], text: 'Anchor Point',\
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

    var anchorPointGroup = UI.anchorPointGroup;
    var offsetPositionGroup = UI.offsetPositionGroup;

    for(var c = 0; c < anchorPointGroup.row1.children.length; c++){
        anchorPointGroup.row1.children[c].onClick = function() {
            for (var i = 0; i < anchorPointGroup.row1.children.length; i++) {
                anchorPointGroup.row2.children[i].value = false;
                anchorPointGroup.row3.children[i].value = false;
            }
        };
    }

    for(var c = 0; c < anchorPointGroup.row2.children.length; c++){
        anchorPointGroup.row2.children[c].onClick = function() {
            for (var i = 0; i < anchorPointGroup.row2.children.length; i++) {
                anchorPointGroup.row1.children[i].value = false;
                anchorPointGroup.row3.children[i].value = false;
            }
        };
    }

    for(var c = 0; c < anchorPointGroup.row3.children.length; c++){
        anchorPointGroup.row3.children[c].onClick = function() {
            for (var i = 0; i < anchorPointGroup.row3.children.length; i++) {
                anchorPointGroup.row1.children[i].value = false;
                anchorPointGroup.row2.children[i].value = false;
            }
        };
    }

    offsetPositionGroup.xText.onChange = function(){
        var xVal = parseFloat(offsetPositionGroup.xText.text);
        if(isNaN(xVal)){
            offsetPositionGroup.xText.text = 0;
        }
    }
    offsetPositionGroup.yText.onChange = function(){
        var yVal = parseFloat(offsetPositionGroup.yText.text);
        if(isNaN(yVal)){
            offsetPositionGroup.yText.text = 0;
        }
    }
    offsetPositionGroup.zText.onChange = function(){
        var zVal = parseFloat(offsetPositionGroup.zText.text);
        if(isNaN(zVal)){
            offsetPositionGroup.zText.text = 0;
        }
    }

    return UI;
};

var UI = createUserInterface(this, resourceString, "EF_Manipulate Anchor Point");



var comp = app.project.activeItem;
var layers = comp.selectedLayers;
var anchorPoints = [];


// if (comp instanceof CompItem && comp != null){
//     // adjustLowerThird(myComp, lowerThirdParameters);
// } else {
//     alert("Please open a composition to continue.");
// }


UI.applyButton.onClick = function(){
    if(layers.length != null) {
        for(var l = 0; l < layers.length; l++){
            var currentLayer = layers[l];
            var sourceRect = currentLayer.sourceRectAtTime(0, false);
            var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");

            var top = sourceRect.top;
            var left = sourceRect.left;
            var width = sourceRect.width;
            var height = sourceRect.height;

            if (UI.anchorPointGroup.row1.a.value){
                anchorPointProp.setValue([left, top]);
            } else if (UI.anchorPointGroup.row1.b.value){
                anchorPointProp.setValue([left + width / 2, top]);
            } else if (UI.anchorPointGroup.row1.c.value){
                anchorPointProp.setValue([left + width, top]);

            } else if (UI.anchorPointGroup.row2.a.value){
                anchorPointProp.setValue([left, top + height / 2]);
            } else if (UI.anchorPointGroup.row2.b.value){
                anchorPointProp.setValue([left + width / 2, top + height / 2]);
            } else if (UI.anchorPointGroup.row2.c.value){
                anchorPointProp.setValue([left + width, top + height / 2]);

            } else if (UI.anchorPointGroup.row3.a.value){
                anchorPointProp.setValue([left, top + height]);
            } else if (UI.anchorPointGroup.row3.b.value){
                anchorPointProp.setValue([left + width / 2, top + height]);
            } else if (UI.anchorPointGroup.row3.c.value){
                anchorPointProp.setValue([left + width, top + height]);
            }
        }
    } else {
            alert("Select a layer to continue.")
    }
};
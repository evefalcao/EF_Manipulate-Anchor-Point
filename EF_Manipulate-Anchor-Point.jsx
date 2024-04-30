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
    offsetAnchorPoint: Panel{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], text: 'Offset Anchor Point',\
        xLabel: StaticText{text:'X'},\
        xText: EditText{text: '0', characters: 4},\
        yLabel: StaticText{text:'Y'},\
        yText: EditText{text: '0', characters: 4},\
        zLabel: StaticText{text:'Z'},\
        zText: EditText{text: '0', characters: 4}\
    },\
    extraActionGroup: Group{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center']\
        addNull: Checkbox{text: 'Add Null'},\
        addExpression: Checkbox{text: 'Add Expression'},\
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
    var offsetAnchorPoint = UI.offsetAnchorPoint;
    // Check the radio button states
    // Row 1
    for(var c = 0; c < anchorPointGroup.row1.children.length; c++){
        anchorPointGroup.row1.children[c].onClick = function() {
            for (var i = 0; i < anchorPointGroup.row1.children.length; i++) {
                anchorPointGroup.row2.children[i].value = false;
                anchorPointGroup.row3.children[i].value = false;
            }
        };
    }
    // Row 2
    for(var c = 0; c < anchorPointGroup.row2.children.length; c++){
        anchorPointGroup.row2.children[c].onClick = function() {
            for (var i = 0; i < anchorPointGroup.row2.children.length; i++) {
                anchorPointGroup.row1.children[i].value = false;
                anchorPointGroup.row3.children[i].value = false;
            }
        };
    }
    // Row 3
    for(var c = 0; c < anchorPointGroup.row3.children.length; c++){
        anchorPointGroup.row3.children[c].onClick = function() {
            for (var i = 0; i < anchorPointGroup.row3.children.length; i++) {
                anchorPointGroup.row1.children[i].value = false;
                anchorPointGroup.row2.children[i].value = false;
            }
        };
    }

    // Default state for the offset value
    offsetAnchorPoint.xText.onChange = function(){
        var xVal = parseFloat(offsetAnchorPoint.xText.text);
        if(isNaN(xVal)){
            offsetAnchorPoint.xText.text = 0;
        }
    }
    offsetAnchorPoint.yText.onChange = function(){
        var yVal = parseFloat(offsetAnchorPoint.yText.text);
        if(isNaN(yVal)){
            offsetAnchorPoint.yText.text = 0;
        }
    }
    offsetAnchorPoint.zText.onChange = function(){
        var zVal = parseFloat(offsetAnchorPoint.zText.text);
        if(isNaN(zVal)){
            offsetAnchorPoint.zText.text = 0;
        }
    }

    return UI;
};

function moveAnchorPoint(layers, comp){
    app.beginUndoGroup("Manipulate Anchor Point");

    for(var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var currentTime = comp.time;
        var positionProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
        var initialPositionValue = positionProp.value;
        var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
        var initialAnchorValue = anchorPointProp.value;
        var finalAnchorValue, pointPosition, pointPositionTxt;

        // Bounding box
        var sourceRect = currentLayer.sourceRectAtTime(currentTime, false);
        var top = sourceRect.top;
        var left = sourceRect.left;
        var width = sourceRect.width;
        var height = sourceRect.height;

        // Check if layer has any expression in the Anchor Point
        if(anchorPointProp.expressionEnabled){
            anchorPointProp.expression = "";
        }

        // Radio button selection
        // Row 1
        if (UI.anchorPointGroup.row1.a.value){
            pointPosition = [left, top];
            pointPositionTxt = "[left, top]";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row1.b.value){
            pointPosition = [left + width / 2, top];
            pointPositionTxt = "[left + width / 2, top]";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row1.c.value){
            pointPosition = [left + width, top];
            pointPositionTxt = "[left + width, top]";
            anchorPointProp.setValue(pointPosition);
        // Row 2
        } else if (UI.anchorPointGroup.row2.a.value){
            pointPosition = [left, top + height / 2];
            pointPositionTxt = "[left, top + height / 2]";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row2.b.value){
            pointPosition = [left + width / 2, top + height / 2];
            pointPositionTxt = "[left + width / 2, top + height / 2]";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row2.c.value){
            pointPosition = [left + width, top + height / 2];
            pointPositionTxt = "[left + width, top + height / 2]";
            anchorPointProp.setValue(pointPosition);
        // Row 3
        } else if (UI.anchorPointGroup.row3.a.value){
            pointPosition = [left, top + height];
            pointPositionTxt = "[left, top + height]";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row3.b.value){
            pointPosition = [left + width / 2, top + height];
            pointPositionTxt = "[left + width / 2, top + height]";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row3.c.value){
            pointPosition = [left + width, top + height];
            pointPositionTxt = "[left + width, top + height]";
            anchorPointProp.setValue(pointPosition);
        }
        finalAnchorValue = anchorPointProp.value;

        // Add the "Offset Anchor Point" value
        var offsetX = parseFloat(UI.offsetAnchorPoint.xText.text);
        var offsetY = parseFloat(UI.offsetAnchorPoint.yText.text);
        var offsetZ = parseFloat(UI.offsetAnchorPoint.zText.text);

        if(offsetX != 0 || offsetY != 0 || offsetZ != 0){
            anchorPointProp.setValue([finalAnchorValue[0] + offsetX, finalAnchorValue[1] + offsetY, finalAnchorValue[2] + offsetZ]);
            finalAnchorValue = anchorPointProp.value;
        };

        // Add expression
        if(UI.extraActionGroup.addExpression.value){
            anchorPointProp.expression = "let layerRect = thisLayer.sourceRectAtTime(time, false);\nlet top = layerRect.top;\nlet left = layerRect.left;\nlet width = layerRect.width;\nlet height = layerRect.height;\n\n" + pointPositionTxt;
        }

        // Move position
        var distance = [finalAnchorValue[0] - initialAnchorValue[0], finalAnchorValue[1] - initialAnchorValue[1], finalAnchorValue[2] - initialAnchorValue[2]]; // final anchor point position - initial anchor point position
        var newPosition = [initialPositionValue[0] + distance[0], initialPositionValue[1] + distance[1], initialPositionValue[2] + distance[2]];
        positionProp.setValue(newPosition);

        if(UI.extraActionGroup.addNull.value){
            if(currentLayer.parent && comp.layer(currentLayer.parent.index).nullLayer){
                comp.layer(currentLayer.parent.index).remove();
            // currentLayer.parent = null;
            }

            var nullCtrl = comp.layers.addNull();
            nullCtrl.name = "Null Control - " + currentLayer.name;
            var nullPositionProp = nullCtrl.property("ADBE Transform Group").property("ADBE Position");
            nullPositionProp.setValue(newPosition);
            currentLayer.parent = nullCtrl;
        }
    }
    app.endUndoGroup();
};

var comp = app.project.activeItem;
var UI = createUserInterface(this, resourceString, "EF_Manipulate Anchor Point");

UI.applyButton.onClick = function(){
    var layers = comp.selectedLayers;
    moveAnchorPoint(layers, comp);
}; v
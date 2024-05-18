/**========================================================================
 * ?                     EF_Manipulate-Anchor-Point.jsx
 * @author         :  Eveline Falcão (https://evelinefalcao.com)
 * @email          :  hello@evelinefalcao.com
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Move Anchor Point to selected layer point. Can add and parent a null to the selected layer point. Can apply an expression to pin the anchor point.
 *========================================================================**/

var resourceString = 
"group{orientation:'column', alignment: ['left', 'top'], alignChildren: ['left', 'top'],\
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
    offsetAnchorPoint: Panel{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], text: 'Offset Point',\
        xLabel: StaticText{text:'X'},\
        xText: EditText{text: '0', characters: 4},\
        yLabel: StaticText{text:'Y'},\
        yText: EditText{text: '0', characters: 4},\
        zLabel: StaticText{text:'Z'},\
        zText: EditText{text: '0', characters: 4}\
    },\
    extraActionGroup: Group{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'top'],\
        nullGroup: Group{orientation: 'column', alignChildren: ['left', 'top'],\
            addNull: Checkbox{text: 'Add Null'},\
            parentToNull: Checkbox{text: 'Parent to Null'},\
        },\
        addExpression: Checkbox{text: 'Add Expression'},\
    },\
    applyButton: Button{text: 'Apply', alignment: ['center', 'bottom']}\
}"

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
    var nullGroup = UI.extraActionGroup.nullGroup;
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

    // Other buttons default states
    anchorPointGroup.row2.b.value = true;
    nullGroup.addNull.value = true;
    nullGroup.parentToNull.value = true;


    return UI;
}

var UI = createUserInterface(this, resourceString, "EF_Manipulate Anchor Point");
var comp = app.project.activeItem;

function moveAnchorPoint(layers, comp){
    app.beginUndoGroup("Manipulate Anchor Point");

    for(var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var currentTime = comp.time;
        var positionProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
        var initialPositionValue = positionProp.value;
        var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
        var initialAnchorValue = anchorPointProp.value;
        var finalAnchorValue, pointPosition, pointPositionTxt, positionTag;

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

        // Add the "Offset Anchor Point" value
        var offsetX = parseFloat(UI.offsetAnchorPoint.xText.text);
        var offsetY = parseFloat(UI.offsetAnchorPoint.yText.text);
        var offsetZ = parseFloat(UI.offsetAnchorPoint.zText.text);

        // Radio button selection
        // Row 1
        if (UI.anchorPointGroup.row1.a.value){
            pointPosition = [left + offsetX, top + offsetY, offsetZ];
            pointPositionTxt = "[left + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Left";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row1.b.value){
            pointPosition = [(left + width / 2) + offsetX, top + offsetY, offsetZ];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Center";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row1.c.value){
            pointPosition = [(left + width) + offsetX, top + offsetY, offsetZ];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Right";
            anchorPointProp.setValue(pointPosition);
        // Row 2
        } else if (UI.anchorPointGroup.row2.a.value){
            pointPosition = [left + offsetX, (top + height / 2) + offsetY, offsetZ];
            pointPositionTxt = "[left + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center Left";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row2.b.value){
            pointPosition = [(left + width / 2) + offsetX, (top + height / 2) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row2.c.value){
            pointPosition = [(left + width) + offsetX, (top + height / 2) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center Right";
            anchorPointProp.setValue(pointPosition);
        // Row 3
        } else if (UI.anchorPointGroup.row3.a.value){
            pointPosition = [left + offsetX, (top + height) + offsetY, offsetZ];
            pointPositionTxt = "[left + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Left";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row3.b.value){
            pointPosition = [(left + width / 2) + offsetX, (top + height) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Center";
            anchorPointProp.setValue(pointPosition);
        } else if (UI.anchorPointGroup.row3.c.value){
            pointPosition = [(left + width) + offsetX, (top + height) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Right";
            anchorPointProp.setValue(pointPosition);
        }

        finalAnchorValue = anchorPointProp.value;

        // Add expression
        if(UI.extraActionGroup.addExpression.value){
            anchorPointProp.expression = "let layerRect = thisLayer.sourceRectAtTime(time, false);\nlet top = layerRect.top;\nlet left = layerRect.left;\nlet width = layerRect.width;\nlet height = layerRect.height;\n\n" + pointPositionTxt;
        }

        // Move position
        var distance = [finalAnchorValue[0] - initialAnchorValue[0], finalAnchorValue[1] - initialAnchorValue[1], finalAnchorValue[2] - initialAnchorValue[2]]; // final anchor point position - initial anchor point position
        var newPosition = [initialPositionValue[0] + distance[0], initialPositionValue[1] + distance[1], initialPositionValue[2] + distance[2]];
        positionProp.setValue(newPosition);

        if(UI.extraActionGroup.nullGroup.addNull.value){
            var nullCtrl = comp.layers.addNull();
            nullCtrl.name = "Null - " + currentLayer.name + " - " + positionTag;
            nullCtrl.parent = currentLayer.parent; // If layer has a parent, the nullCtrl parent will be set between the layer and its parent
            nullCtrl.moveBefore(currentLayer); // Move created null before currentLayer

            nullCtrl.threeDLayer = currentLayer.threeDLayer; // If current layer is threeD (true), nullCtrl is threeD (true) and vice versa
            var nullPositionProp = nullCtrl.property("ADBE Transform Group").property("ADBE Position");

            nullPositionProp.setValue(newPosition);

            if(UI.extraActionGroup.nullGroup.parentToNull.value){
                currentLayer.parent = nullCtrl;
            }
            currentLayer.selected = true;
            nullCtrl.selected = false;
        }
    }
    app.endUndoGroup();
}

UI.applyButton.onClick = function(){
    var layers = comp.selectedLayers;
    moveAnchorPoint(layers, comp);
}
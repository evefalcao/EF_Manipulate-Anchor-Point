﻿/**========================================================================
 * ?                  EF_Manipulate-Anchor-Point.jsx
 * @author            Eveline Falcão (https://evelinefalcao.com)
 * @email             hello@evelinefalcao.com
 * @version           1.0.0
 * @createdFor        Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description       Move Anchor Point to selected layer point. Can add and parent a null to the selected layer point. Can apply an expression to pin the anchor point.
 * @thankyou          Charles Bordenave (https://www.nabscripts.com) for RepositionAnchorPoint (version: 3.9) and Zack Lovatt (https://lova.tt/) for zl_CreatePivotalNull (version: 1.1).
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
        otherGroup: Group{orientation: 'column', alignChildren: ['left', 'top'],\
            rotateNull: Checkbox{text: 'Rotate Null'},\
            addExpression: Checkbox{text: 'Add Expression'},\
        },\
    },\
    applyButton: Button{text: 'Apply', alignment: ['center', 'bottom']}\
}"

function createUserInterface(thisObj, userInterfaceString, scriptName){

    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable: true});
    if (pal == null) return pal;

    var UI = pal.add(userInterfaceString);

    pal.layout.layout(true);
    pal.layout.resize();
    pal.onResizing = pal.onResize = function(){
        this.layout.resize();
    }
    if ((pal != null) && (pal instanceof Window)){
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
    nullGroup.addNull.value = false;
    nullGroup.parentToNull.value = false;

    return UI;
}

var UI = createUserInterface(this, resourceString, "EF_Manipulate Anchor Point");

// Reset rotation
function setPropertyValue(comp, property, value){
    // Function inspired by zl_CreatePivotalNull_setKeys
    var currentTime = comp.time;
    if(property.isTimeVarying){
        var nearestKeyframeIndex = property.nearestKeyIndex(currentTime);
        property.setValueAtKey(nearestKeyframeIndex, value);
    } else {
        property.setValue(value);
    }
}

// Bounding Box, also considers layers with masks
function getBoundingBox(layer) {
    var comp = layer.containingComp;
    var currentTime = comp.time;
    var boundingBox = {};

    if (layer.Masks.numProperties) {
        var maskGroup = layer.Masks;
        var top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
        var numMasks = maskGroup.numProperties;

        for (var mask = 1; mask <= numMasks; mask++) {
            var maskShape = maskGroup.property(mask).maskShape;
            var shape = maskShape.valueAtTime(currentTime, false);
            var verts = shape.vertices;
            var inTangents = shape.inTangents;
            var outTangents = shape.outTangents;

            for (var i = 0; i < verts.length; i++) {
                var vx = verts[i][0];
                var vy = verts[i][1];
                var inX = vx + inTangents[i][0];
                var inY = vy + inTangents[i][1];
                var outX = vx + outTangents[i][0];
                var outY = vy + outTangents[i][1];

                left = Math.min(left, vx, inX, outX);
                right = Math.max(right, vx, inX, outX);
                top = Math.min(top, vy, inY, outY);
                bottom = Math.max(bottom, vy, inY, outY);
            }
            
            boundingBox.width = right - left;
            boundingBox.height = bottom - top;
            boundingBox.left = left;
            boundingBox.top = top;
        }
    } else {
        var sourceRect = layer.sourceRectAtTime(currentTime, true);
        boundingBox.width = sourceRect.width;
        boundingBox.height = sourceRect.height;
        boundingBox.left = sourceRect.left;
        boundingBox.top = sourceRect.top;
    }

    return boundingBox;
}

function moveAnchorPoint(){
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;

    app.beginUndoGroup("Manipulate Anchor Point");

    for(var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var currentTime = comp.time;
        var positionProp = currentLayer.property("ADBE Transform Group").property("ADBE Position");
        var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
        var scaleProp = currentLayer.property("ADBE Transform Group").property("ADBE Scale");
        var orientationProp = currentLayer.property("ADBE Transform Group").property("ADBE Orientation");
        var xRotationProp = currentLayer.property("ADBE Transform Group").property("ADBE Rotate X");
        var yRotationProp = currentLayer.property("ADBE Transform Group").property("ADBE Rotate Y");
        var zRotationProp = currentLayer.property("ADBE Transform Group").property("ADBE Rotate Z");

        var initialPositionValue = positionProp.value;
        var initialAnchorValue = anchorPointProp.value;
        var initialScaleProp = scaleProp.value;
        var initialOrientationProp = orientationProp.value;
        var initialXRotationProp = xRotationProp.value;
        var initialYRotationProp = yRotationProp.value;
        var initialZRotationProp = zRotationProp.value;
        var resetRotation = false;
        var resetScale = false;

        var finalAnchorValue, pointPosition, pointPositionTxt, positionTag, originDistanceToNewAnchorPoint, newAnchorPositionId;

        // Bounding box
        var sourceRect = getBoundingBox(currentLayer);
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
            newAnchorPositionId = 0;
        } else if (UI.anchorPointGroup.row1.b.value){
            pointPosition = [(left + width / 2) + offsetX, top + offsetY, offsetZ];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Center";
            newAnchorPositionId = 1;
        } else if (UI.anchorPointGroup.row1.c.value){
            pointPosition = [(left + width) + offsetX, top + offsetY, offsetZ];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Right";
            newAnchorPositionId = 2;
        // Row 2
        } else if (UI.anchorPointGroup.row2.a.value){
            pointPosition = [left + offsetX, (top + height / 2) + offsetY, offsetZ];
            pointPositionTxt = "[left + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center Left";
            newAnchorPositionId = 3;
        } else if (UI.anchorPointGroup.row2.b.value){
            pointPosition = [(left + width / 2) + offsetX, (top + height / 2) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center";
            newAnchorPositionId = 4;
        } else if (UI.anchorPointGroup.row2.c.value){
            pointPosition = [(left + width) + offsetX, (top + height / 2) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center Right";
            newAnchorPositionId = 5;
        // Row 3
        } else if (UI.anchorPointGroup.row3.a.value){
            pointPosition = [left + offsetX, (top + height) + offsetY, offsetZ];
            pointPositionTxt = "[left + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Left";
            newAnchorPositionId = 6;
        } else if (UI.anchorPointGroup.row3.b.value){
            pointPosition = [(left + width / 2) + offsetX, (top + height) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Center";
            newAnchorPositionId = 7;
        } else if (UI.anchorPointGroup.row3.c.value){
            pointPosition = [(left + width) + offsetX, (top + height) + offsetY, offsetZ];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Right";
            newAnchorPositionId = 8;
        }

        // Position + Anchor Point workaround - Charles Bordenave's solution is the best I found.
        var anchorGridX = (newAnchorPositionId % 3) - 1;
		var anchorGridY = Math.floor(newAnchorPositionId / 3) - 1;
        var centerWidth = width / 2;
		var centerHeight = height / 2;

        /*
        Anchor Point expression: 
            fromWorld(toWorld([centerWidth, centerHeight, 0] + [(anchorGridX * centerWidth + left + offsetX), (anchorGridY * centerHeight + top + offsetY), offsetZ]));
        */
        anchorPointProp.expression = 
        "fromWorld(toWorld([" + centerWidth + ", " + centerHeight + ", 0] + [(" + anchorGridX + " * " + centerWidth + " + " + left + " + " + offsetX + "), (" + anchorGridY + " * "+ centerHeight + " + " + top + " + " + offsetY + "), " + offsetZ + "]));";
        
        /*
        Position Expression:
            try {
                parent.fromWorld(toWorld([centerWidth, centerHeight, 0] + [(anchorGridX * centerWidth + left + offsetX), (anchorGridY * centerHeight + top + offsetY), offsetZ]));
            }
            catch(e){
                toWorld([centerWidth, centerHeight, 0] + [(anchorGridX * centerWidth + left + offsetX), (anchorGridY * centerHeight + top + offsetY), offsetZ]);
            }
        */
        positionProp.expression =
        "try {\r" +
        "\tparent.fromWorld(toWorld([" + centerWidth + ", " + centerHeight + ", 0] + [(" + anchorGridX + " * " + centerWidth + " + " + left + " + " + offsetX + "), (" + anchorGridY + " * "+ centerHeight + " + " + top + " + " + offsetY + "), " + offsetZ + "]));\r" +
        "}\r" +
        "catch(e){\r" +
        "\ttoWorld([" + centerWidth + ", " + centerHeight + ", 0] + [(" + anchorGridX + " * " + centerWidth + " + " + left + " + " + offsetX + "), (" + anchorGridY + " * " + centerHeight + " + " + top + " + " + offsetY + "), " + offsetZ + "]);\r" +
        "}";

		positionProp.expressionEnabled = false;
		positionProp.expressionEnabled = true;
        var newAnchorValue = anchorPointProp.valueAtTime(currentTime, false);
		anchorPointProp.expression = "";
		var newPositionValue = positionProp.valueAtTime(currentTime, false);
		positionProp.expression = "";
        setPropertyValue(comp, positionProp, newPositionValue);
        setPropertyValue(comp, anchorPointProp, newAnchorValue);

        // Create null
        var ifAddNull = UI.extraActionGroup.nullGroup.addNull.value;
        var ifParentToNull = UI.extraActionGroup.nullGroup.parentToNull.value;
        if(ifAddNull){
            var nullCtrl = comp.layers.addNull();
            nullCtrl.name = "Null - " + currentLayer.name + " - " + positionTag;
            nullCtrl.moveBefore(currentLayer); // Move created null before currentLayer

            nullCtrl.parent = currentLayer.parent; // If layer has a parent, the nullCtrl parent will be set between the layer and its parent
            nullCtrl.threeDLayer = currentLayer.threeDLayer; // If current layer is threeD (true), nullCtrl is threeD (true) and vice versa

            var nullCtrlProps = nullCtrl.property("ADBE Transform Group");
            var nullPositionProp = nullCtrlProps.property("ADBE Position");
            var nullRotationProp = nullCtrlProps.property("ADBE Orientation");
            var nullRotationProp = nullCtrlProps.property("ADBE Rotate X");
            var nullRotationProp = nullCtrlProps.property("ADBE Rotate Y");
            var nullRotationProp = nullCtrlProps.property("ADBE Rotate Z");
            setPropertyValue(comp, nullPositionProp, newPositionValue)

            if(UI.extraActionGroup.otherGroup.rotateNull.value){
                if(nullCtrl.threeD){
                    setPropertyValue(comp, nullRotationProp, initialOrientationProp);
                    setPropertyValue(comp, nullRotationProp, initialXRotationProp);
                    setPropertyValue(comp, nullRotationProp, initialYRotationProp);
                    setPropertyValue(comp, nullRotationProp, initialZRotationProp);
                }
                setPropertyValue(comp, nullRotationProp, initialZRotationProp);
            }

            currentLayer.selected = true;
            nullCtrl.selected = false;
        }

        // Add expression
        if(UI.extraActionGroup.otherGroup.addExpression.value){
            anchorPointProp.expression = "let layerRect = thisLayer.sourceRectAtTime(time, true);\nlet top = layerRect.top;\nlet left = layerRect.left;\nlet width = layerRect.width;\nlet height = layerRect.height;\n\n" + pointPositionTxt;
        }

        // Parent layer to null
        if(ifParentToNull){
            currentLayer.parent = nullCtrl;
        }

    }
    app.endUndoGroup();
}

UI.applyButton.onClick = function(){
    moveAnchorPoint();
}
/**========================================================================
 * ?                  EF_Manipulate-Anchor-Point.jsx
 * @author         :  Eveline Falcão (https://evelinefalcao.com)
 * @email          :  hello@evelinefalcao.com
 * @version        :  1.0.0
 * @createdFor     :  Adobe After Effects CC 2024 (Version 24.1.0 Build 78)
 * @description    :  Move Anchor Point to selected layer point. Can add and parent a null to the selected layer point. Can apply an expression to pin the anchor point.
 * @thankyou       :  Charles Bordenave (https://www.nabscripts.com) for RepositionAnchorPoint (version: 3.9) and Zack Lovatt (https://lova.tt/) for zl_CreatePivotalNull (version: 1.1).
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

// function rotatePointAroundAnchor(point, rotation, anchorPoint){
//     var pitch = rotation[0] * Math.PI / 180;
//     var yaw = rotation[1] * Math.PI / 180;
//     var roll = rotation[2] * Math.PI / 180;

//     var cosa = Math.cos(yaw);
//     var sina = Math.sin(yaw);

//     var cosb = Math.cos(pitch);
//     var sinb = Math.sin(pitch);

//     var cosc = Math.cos(roll);
//     var sinc = Math.sin(roll);

//     var Axx = cosa*cosb;
//     var Axy = cosa*sinb*sinc - sina*cosc;
//     var Axz = cosa*sinb*cosc + sina*sinc;

//     var Ayx = sina*cosb;
//     var Ayy = sina*sinb*sinc + cosa*cosc;
//     var Ayz = sina*sinb*cosc - cosa*sinc;

//     var Azx = -sinb;
//     var Azy = cosb*sinc;
//     var Azz = cosb*cosc;

//     var px = point[0] - anchorPoint[0];
//     var py = point[1] - anchorPoint[1];
//     var pz = point[2] - anchorPoint[2];

//     return [
//         (Axx*px + Axy*py + Axz*pz) + anchorPoint[0],
//         (Ayx*px + Ayy*py + Ayz*pz) + anchorPoint[1],
//         (Azx*px + Azy*py + Azz*pz) + anchorPoint[2],
//     ];
// }

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

function moveAnchorPoint(){
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    // comp.selected = true;
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
        
        // // Reset rotation
        // if(currentLayer.threeDLayer){
        //     if(orientationProp.isModified || xRotationProp.isModified || yRotationProp.isModified || zRotationProp.isModified){
        //         setPropertyValue(comp, orientationProp, [0, 0, 0]);
        //         setPropertyValue(comp, xRotationProp, 0);
        //         setPropertyValue(comp, yRotationProp, 0);
        //         setPropertyValue(comp, zRotationProp, 0);
        //         resetRotation = true;
        //     }
        // } else if(zRotationProp.isModified){
        //     setPropertyValue(comp, zRotationProp, 0);
        //     resetRotation = true;
        // }

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

        // Center position
        // pointPosition = [width/2, height/2, 0];

        // Radio button selection
        // Row 1
        if (UI.anchorPointGroup.row1.a.value){
            pointPosition = [left + offsetX, top + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [0, 0, 0];
            pointPositionTxt = "[left + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Left";
            newAnchorPositionId = 0;
        } else if (UI.anchorPointGroup.row1.b.value){
            pointPosition = [(left + width / 2) + offsetX, top + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [width / 2, 0, 0];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Center";
            newAnchorPositionId = 1;
        } else if (UI.anchorPointGroup.row1.c.value){
            pointPosition = [(left + width) + offsetX, top + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [width, 0, 0];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "top + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Top Right";
            newAnchorPositionId = 2;
        // Row 2
        } else if (UI.anchorPointGroup.row2.a.value){
            pointPosition = [left + offsetX, (top + height / 2) + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [0, height / 2, 0];
            pointPositionTxt = "[left + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center Left";
            newAnchorPositionId = 3;
        } else if (UI.anchorPointGroup.row2.b.value){
            pointPosition = [(left + width / 2) + offsetX, (top + height / 2) + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [width / 2, height / 2, 0];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center";
            newAnchorPositionId = 4;
        } else if (UI.anchorPointGroup.row2.c.value){
            pointPosition = [(left + width) + offsetX, (top + height / 2) + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [width, height / 2, 0];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "(top + height / 2) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Center Right";
            newAnchorPositionId = 5;
        // Row 3
        } else if (UI.anchorPointGroup.row3.a.value){
            pointPosition = [left + offsetX, (top + height) + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [0, height, 0];
            pointPositionTxt = "[left + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Left";
            newAnchorPositionId = 6;
        } else if (UI.anchorPointGroup.row3.b.value){
            pointPosition = [(left + width / 2) + offsetX, (top + height) + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [width / 2, height, 0];
            pointPositionTxt = "[(left + width / 2) + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Center";
            newAnchorPositionId = 7;
        } else if (UI.anchorPointGroup.row3.c.value){
            pointPosition = [(left + width) + offsetX, (top + height) + offsetY, offsetZ];
            // originDistanceToNewAnchorPoint = [width, height, 0];
            pointPositionTxt = "[(left + width) + " + offsetX + ", " + "(top + height) + " + offsetY + ", " + offsetZ + "]";
            positionTag = "Bottom Right";
            newAnchorPositionId = 8;
        }

        // var totalRotation = [initialXRotationProp + initialOrientationProp[0], initialYRotationProp + initialOrientationProp[1], initialZRotationProp + initialOrientationProp[2]];
        // anchorPointProp.setValue(rotatePointAroundAnchor(pointPosition, totalRotation, initialAnchorValue));
        // var newPosX = anchorPointProp.value[0] - originDistanceToNewAnchorPoint[0];
        // var newPosY = anchorPointProp.value[1] - originDistanceToNewAnchorPoint[1];
        // var newPosZ = anchorPointProp.value[2] - originDistanceToNewAnchorPoint[2];
        // var newPos = [newPosX, newPosY, newPosZ];
        // anchorPointProp.setValue(newPos);

        // setPropertyValue(comp, anchorPointProp, pointPosition);
        // finalAnchorValue = anchorPointProp.value;

        // // Move position
        // var xOffset = (finalAnchorValue[0] - initialAnchorValue[0]) * (scaleProp.value[0]/100);
        // var yOffset = (finalAnchorValue[1] - initialAnchorValue[1]) * (scaleProp.value[1]/100);
        // var zOffset = (finalAnchorValue[2] - initialAnchorValue[2]) * (scaleProp.value[2]/100);
        // var offset = [xOffset, yOffset, zOffset]; // Final anchor point position minus initial anchor point position times the scale
        // var newPosition = [initialPositionValue[0] + offset[0], initialPositionValue[1] + offset[1], initialPositionValue[2] + offset[2]];
        // setPropertyValue(comp, positionProp, newPosition);

        // Position + Anchor Point workaround - Charles Bordenave's solution is the best I found.
        var anchorGridX = (newAnchorPositionId % 3) - 1;
		var anchorGridY = Math.floor(newAnchorPositionId / 3) - 1;
        var centerWidth = width / 2;
		var centerHeight = height / 2;
        anchorPointProp.expression = 
        "fromWorld(toWorld([" + centerWidth + "," + centerHeight + ",0] + [" + anchorGridX + "*" + centerWidth + "+" + offsetX + "," + anchorGridY + "*"+ centerHeight + "+" + offsetY + ",0" + offsetZ + "]));";
        positionProp.expression =
        "try {\r" +
        "	parent.fromWorld(toWorld([" + centerWidth + "," + centerHeight + ",0] + [" + anchorGridX + "*" + centerWidth + "+" + offsetX + "," + anchorGridY + "*"+ centerHeight + "+" + offsetY + ",0" + offsetZ + "]));\r" +
        "}\r" +
        "catch(e)\r" +
        "{\r" +
        "  toWorld([" + centerWidth + "," + centerHeight + ",0] + [" + anchorGridX + "*" + centerWidth + "+" + offsetX + "," + anchorGridY + "*"+ centerHeight + "+" + offsetY + ",0" + offsetZ + "]);\r" +
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

            var nullPositionProp = nullCtrl.property("ADBE Transform Group").property("ADBE Position");
            var nullRotationProp = nullCtrl.property("ADBE Transform Group").property("ADBE Orientation");
            var nullRotationProp = nullCtrl.property("ADBE Transform Group").property("ADBE Rotate X");
            var nullRotationProp = nullCtrl.property("ADBE Transform Group").property("ADBE Rotate Y");
            var nullRotationProp = nullCtrl.property("ADBE Transform Group").property("ADBE Rotate Z");
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

        // // Return rotation to its original value
        // if(resetRotation){
        //     if(ifAddNull){
        //         nullCtrl.parent = currentLayer;
        //     }
 
        //     if(currentLayer.threeDLayer){
        //         setPropertyValue(comp, orientationProp, initialOrientationProp);
        //         setPropertyValue(comp, xRotationProp, initialXRotationProp);
        //         setPropertyValue(comp, yRotationProp, initialYRotationProp);
        //         setPropertyValue(comp, zRotationProp, initialZRotationProp);
        //     } else {
        //         setPropertyValue(comp, zRotationProp, initialZRotationProp);
        //     }

        //     if(ifAddNull){
        //         nullCtrl.parent = null;
        //     }
        // }

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
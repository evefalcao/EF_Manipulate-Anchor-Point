var comp = app.project.activeItem;
var layers = comp.selectedLayers;
var anchorPoints = [];

if (layers.length != null) {
    for (var l = 0; l < layers.length; l++){
        var currentLayer = layers[l];
        var sourceRect = currentLayer.sourceRectAtTime(0, false);
        var anchorPointProp = currentLayer.property("ADBE Transform Group").property("ADBE Anchor Point");

        // var sourceRect = currentLayer;
        var top = sourceRect.top;
        var left = sourceRect.left;
        var width = sourceRect.width;
        var height = sourceRect.height;

        anchorPointProp.setValue([left + width, top + height / 2]);

        // if (UI.anchorPointGroup.row1.a.value){
            // anchorPointProp.setValue([left, top]);
        // }
    }
}
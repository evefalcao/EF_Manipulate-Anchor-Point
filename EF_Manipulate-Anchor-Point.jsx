var resourceString = 
"group{orientation:'column', alignment: ['fill', 'fill'], alignChildren: ['left', 'top'],\
    offsetPosition: Panel{orientation: 'row', alignment: ['fill', 'fill'], alignChildren: ['center', 'center'], text: 'Offset position',\
        xTitle: StaticText{text:'X'},\
        xText: EditText{text: '0', characters: 3},\
        yTitle: StaticText{text:'Y'},\
        yText: EditText{text: '0', characters: 3},\
        zTitle: StaticText{text:'Z'},\
        zText: EditText{text: '0', characters: 3}\
    },\
    addNull: Checkbox{alignment: 'left', text: 'Add null?'},\
    addExpression: Checkbox{alignment: 'left', text: 'Add expression?'},\
    applyButton: Button{text: 'Apply', alignment: ['center', 'bottom']}\
}";

function createUserInterface (thisObj, userInterfaceString, scriptName){

    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable: true});
    if (pal == null) return pal;

    var anchorPoint = pal.add("Panel { alignment: ['fill', 'fill'], text: 'Anchor point' }");
    
    var row1 = anchorPoint.add("group");
    var row2 = anchorPoint.add("group");
    var row3 = anchorPoint.add("group");
    
    for (var i = 0; i < 3; i++) {
        row1.add("radiobutton");
        row2.add("radiobutton");
        row3.add("radiobutton");
    }
    
    row1.addEventListener("click", function () {
        for (var i = 0; i < row1.children.length; i++) {
            row2.children[i].value = false;
            row3.children[i].value = false;
        }
    });
    row2.addEventListener("click", function () {
        for (var i = 0; i < row2.children.length; i++) {
        row1.children[i].value = false;
        row3.children[i].value = false;
        }
    });
    row3.addEventListener("click", function () {
        for (var i = 0; i < row3.children.length; i++) {
            row1.children[i].value = false;
            row2.children[i].value = false;
        }
    });

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

createUserInterface(this, resourceString, "Manipulate Anchor Point");
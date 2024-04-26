var resourceString = 
"group{orientation:'column', alignment:['fill', 'fill'], alignChildren:['left', 'top'],\
    anchorPoint: Panel{orientation:'column', alignment:['fill', 'fill'], alignChildren:['center', 'center'],\
    text: 'Anchor Point',\
        topRow: Group{orientation:'row',\
            topLeft: RadioButton{text:''},\
            topCenter: RadioButton{text:''},\
            topRight: RadioButton{text:''}\
        },\
        middleRow: Group{orientation:'row',\
            midLeft: RadioButton{text:''},\
            midCenter: RadioButton{text:''},\
            midRight: RadioButton{text:''}\
        },\
        bottomRow: Group{orientation:'row',\
            bottomLeft: RadioButton{text:''},\
            bottomCenter: RadioButton{text:''},\
            bottomRight: RadioButton{text:''}\
        },\
    },\
    shiftPoint: Panel{orientation:'row', alignment:['fill', 'fill'], alignChildren:['center', 'center'],\
        text: 'Shift Position',\
        xText: EditText{text:'0', characters:3},\
        yText: EditText{text:'0', characters:3},\
        zText: EditText{text:'0', characters:3}\
    },\
    addNull: Checkbox{alignment:'left', text:'Add null?'},\
    addExpression: Checkbox{alignment:'left', text:'Add expression?'},\
    applyButton: Button{text:'Apply', alignment:['center','bottom']}\
}";

function createUserInterface (thisObj, userInterfaceString, scriptName){
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

    userInterfaceString.topRow.addEventListener("click", function() {
        for (var i = 0; i < userInterfaceString.middleRow.children.length; i++) {
            userInterfaceString.middleRow.children[i].value = false;
        }
    });
    userInterfaceString.topRow.addEventListener("click", function() {
        for (var i = 0; i < userInterfaceString.bottomRow.children.length; i++) {
            userInterfaceString.bottomRow.children[i].value = false;
        }
    });

    userInterfaceString.middleRow.addEventListener("click", function() {
        for (var i = 0; i < userInterfaceString.topRow.children.length; i++) {
            userInterfaceString.topRow.children[i].value = false;
        }
    });
    userInterfaceString.middleRow.addEventListener("click", function() {
        for (var i = 0; i < userInterfaceString.bottomRow.children.length; i++) {
            userInterfaceString.bottomRow.children[i].value = false;
        }
    });

    userInterfaceString.bottomRow.addEventListener("click", function() {
        for (var i = 0; i < userInterfaceString.middleRow.children.length; i++) {
            userInterfaceString.topRow.children[i].value = false;
        }
    });
    userInterfaceString.bottomRow.addEventListener("click", function() {
        for (var i = 0; i < userInterfaceString.middleRow.children.length; i++) {
            userInterfaceString.topRow.children[i].value = false;
        }
    });

    return UI;
};

createUserInterface(this, resourceString, "Manipulate Anchor Point");
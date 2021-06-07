import "vueditor/dist/style/vueditor.min.css";
import Vue from "vue";
import Vueditor from "vueditor";

// Vueditor Config
let config = {
    toolbar: [
        "removeFormat",
        "undo",
        "|",
        "elements",
        "fontName",
        "fontSize",
        "foreColor",
        "backColor",
        "divider",
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "links",
        "divider",
        "subscript",
        "superscript",
        "divider",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "|",
        "indent",
        "outdent",
        "insertOrderedList",
        "insertUnorderedList",
        "tables",
        "|",
        "switchView",
    ],
    fontName: [
        { val: "Arial" },
        { val: "Arial Black" },
        { val: "Comic Sans MS" },
        { val: "Courier New" },
        { val: "Georgia" },
        { val: "Impact" },
        { val: "Lucida Sans Unicode" },
        { val: "Tahoma" },
        { val: "Times New Roman" },
        { val: "Verdana" },
    ],
    fontSize: ["12px", "14px", "16px", "18px", "0.8rem", "1.0rem", "1.2rem", "1.5rem", "2.0rem"],
    classList: ["test-color"],
};

Vue.use(Vueditor, config);

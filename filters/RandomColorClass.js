import Tools from "@/utils/Tools";

export function randomColorClass(value) {
    return "color" + Tools.randomColor(value);
}

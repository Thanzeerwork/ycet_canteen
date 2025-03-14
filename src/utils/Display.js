import { Dimensions } from "react-native";

const {height,width} = Dimensions.get("window")

const setheight = (h) =>(height/100)*h
const setwidth = (w) =>(width/100)*w

export default {setheight,setwidth}
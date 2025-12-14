import { atom } from "jotai";
import { Vector2 } from "../hooks/UseMousePosition";

export const canvasOffsetState = atom<Vector2>({ x: 0, y: 0 })

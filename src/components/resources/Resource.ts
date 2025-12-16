import shortid from "shortid"
import { Vector2 } from "../../hooks/UseMousePosition"

export type ResourceComponent = {
    debug: boolean
    startingPosition: Vector2
}

export const generateResourceId = (prefix: string) => {
    shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-")
    const id = shortid.generate().replace(/-/g, 'a').replace(/_/g, 'A')

    return `${prefix}_${id}`
}

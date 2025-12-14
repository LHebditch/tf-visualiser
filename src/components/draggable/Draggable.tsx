import { FC, ReactElement, useEffect, useState } from "react"
import useMousePosition, { Vector2 } from "../../hooks/UseMousePosition"
import { ResourceType, selectedResourceState } from "../../state/Resource"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { canvasOffsetState } from "../../state/Canvas"
import { iacState } from "../../state/IAC"
import styles from '../resources/Resource.module.css'

type Props = {
    children: ReactElement | ReactElement[]
    startingPosition: Vector2
    resourceType: ResourceType
    resourceId: string
    debug?: boolean
}

const Draggable: FC<Props> = ({ children, startingPosition, resourceType, resourceId, debug }) => {
    const mousePosition = useMousePosition()

    const [dragging, setDragging] = useState(false)
    const [pos, setPos] = useState<Vector2>(startingPosition)
    const [offset, setOffset] = useState<Vector2>({ x: 0, y: 0 })

    const canvasOffset = useAtomValue(canvasOffsetState)
    const setSelectedResource = useSetAtom(selectedResourceState)
    const [iac, setIAC] = useAtom(iacState)

    const x = dragging ? mousePosition.x - offset.x : canvasOffset.x + pos.x
    const y = dragging ? mousePosition.y - offset.y : canvasOffset.y + pos.y

    const onMouseDown = () => {
        const xOffset = Math.abs(mousePosition.x - (pos.x + canvasOffset.x))
        const yOffset = Math.abs(mousePosition.y - (pos.y + canvasOffset.y))

        setOffset({ x: xOffset, y: yOffset })
        setDragging(true)
        setSelectedResource({
            id: resourceId,
            resourceType,
        })
    }

    const onMouseUp = () => {
        const pos = {
            x: (mousePosition.x - offset.x) - canvasOffset.x,
            y: (mousePosition.y - offset.y) - canvasOffset.y
        }
        setPos(pos)
        setDragging(false)
    }

    useEffect(() => {
        const current = iac.find(i => i.state.id === resourceId)

        if (!current) {
            return
        }

        current.pos = { x, y }
        setIAC([
            ...iac.filter(i => i.state.id !== resourceId),
            current,
        ])
    }, [x, y]) // only want to react when x or y change

    return <g
        transform={`translate(${x},${y})`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        data-resource-type={resourceType}
        className={styles.resource}
        data-resource-id={resourceId}
    >
        {debug && <>
            <text className="debug-text" y={-30}>canvas offset: {`{ x: ${canvasOffset.x}, y: ${canvasOffset.y} }`}</text>
            <text className="debug-text" y={-20}>offset: {`{ x: ${offset.x}, y: ${offset.y} }`}</text>
            <text className="debug-text" y={-10}>position: {`{ x: ${pos.x}, y: ${pos.y} }`}</text>
        </>}

        {children}
    </g>
}

export default Draggable

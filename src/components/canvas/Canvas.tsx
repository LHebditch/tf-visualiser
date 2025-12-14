import { useAtom, useSetAtom } from "jotai"
import { FC, MouseEventHandler, ReactElement, useEffect, useRef, useState } from "react"
import { canvasOffsetState } from "../../state/Canvas"
import useMousePosition, { type Vector2 } from "../../hooks/UseMousePosition"
import { ResourceType, selectedResourceState } from "../../state/Resource"
import styles from './Canvas.module.css'

type Props = {
    children: ReactElement | ReactElement[]
}

const Canvas: FC<Props> = ({ children }) => {
    const mousePosition = useMousePosition()

    const [offsetting, setOffsetting] = useState(false)
    const [offsetStart, setOffsetStart] = useState<Vector2>({ x: 0, y: 0 })

    const [canvasOffset, setCanvasOffset] = useAtom(canvasOffsetState)
    const setSelectedResource = useSetAtom(selectedResourceState)

    const ref = useRef<SVGSVGElement | null>(null)

    useEffect(() => {
        const handleScroll = (ev: Event): void => {
            if (ev.target !== ref?.current) {
                return
            }
            const { deltaX, deltaY } = ev as WheelEvent
            const newOffsetX = canvasOffset.x - deltaX
            const newOffsetY = canvasOffset.y + deltaY

            setCanvasOffset({
                x: newOffsetX,
                y: newOffsetY
            })
        }

        window.addEventListener('mousewheel', handleScroll)

        return () => {
            window.removeEventListener('mousewheel', handleScroll)
        }
    }, [canvasOffset, setCanvasOffset])

    const onMouseDown: MouseEventHandler<SVGSVGElement> = e => {
        if (e.target !== ref?.current) {
            return
        }
        e.preventDefault()
        setOffsetStart(mousePosition)
        setOffsetting(true)

        setSelectedResource({
            id: '',
            resourceType: ResourceType.NULL
        })
    }

    const offsetCanvas = () => {
        if (!offsetting) {
            return
        }
        const xAdjustment = mousePosition.x - offsetStart.x
        const yAdjustment = mousePosition.y - offsetStart.y
        const o = {
            x: canvasOffset.x + xAdjustment,
            y: canvasOffset.y + yAdjustment
        }
        setOffsetStart(mousePosition)
        setCanvasOffset(o)
    }

    return <svg
        ref={ref}
        className={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseUp={() => setOffsetting(false)}
        onMouseMove={offsetCanvas}
    >
        {children}
    </svg>
}

export default Canvas
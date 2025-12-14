import { useState, useEffect } from 'react'

export type Vector2 = {
    x: number
    y: number
}

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState<Vector2>({ x: 0, y: 0 })

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY })
        }

        window.addEventListener('mousemove', updateMousePosition)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
        }
    }, [])

    return mousePosition
}

export default useMousePosition

import { fireEvent, renderHook } from "@testing-library/react"
import useMousePosition from "./UseMousePosition"

describe('Use Mouse Position Hook', () => {
    it('should update with mousemove event', () => {
        const { result } = renderHook(() => useMousePosition())

        expect(result.current.x).toBe(0)
        expect(result.current.y).toBe(0)

        const event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: 80,
            clientY: 25
        })
        fireEvent(window, event)

        expect(result.current.x).toBe(80)
        expect(result.current.y).toBe(25)
    })
})
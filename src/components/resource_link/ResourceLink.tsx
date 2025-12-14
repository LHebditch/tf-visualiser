import { FC, useEffect, useState } from "react";
import { iacState, Permission } from "../../state/IAC";
import { useAtomValue } from "jotai";
import { Vector2 } from "../../hooks/UseMousePosition";

const ResourceLink: FC<Permission> = ({
    source,
    target,
}) => {
    const iac = useAtomValue(iacState)

    const [startPos, setStartPos] = useState<Vector2>({ x: 0, y: 0 })
    const [endPos, setEndPos] = useState<Vector2>({ x: 0, y: 0 })

    useEffect(() => {
        const from = iac.find(i => i.state.id === source.id)
        const to = iac.find(i => i.state.id === target.id)

        if (from) {
            setStartPos(from.pos)
        }
        if (to) {
            setEndPos(to.pos)
        }

    }, [iac, source.id, target.id])

    return <g>
        <line
            x1={startPos.x + 32}
            y1={startPos.y + 32}
            x2={endPos.x + 32}
            y2={endPos.y + 32}
            stroke="black"
            strokeWidth={1}
            strokeDasharray="5,5"
        />
    </g>
}

export default ResourceLink
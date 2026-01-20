import { FC, useMemo } from "react";
import { IACResource, Permission } from "../../../state/IAC";
import { Resource, ResourceType, selectedResourceState } from "../../../state/Resource";
import { useAtomValue } from "jotai";
import { ResourceComponent } from "../Resource";
import Draggable from "../../draggable/Draggable";
import styles from "../Resource.module.css"
import dedent from "dedent";
import LambdaIcon from "../icons/LambdaIcon";

export type LambdaResourceState = Resource & {
    functionName: string
    image: string
    env?: { [key: string]: string }
}

export type LambdaResource = IACResource & { state: LambdaResourceState }

const LambdaResourceViz: FC<LambdaResourceState & ResourceComponent> = ({ id, debug, functionName, image, startingPosition }) => {
    const selectedResource = useAtomValue(selectedResourceState)
    const inErrorState = useMemo(() => {
        if (image === '') {
            return true
        }
        if (functionName === '') {
            return true
        }
        return false
    }, [functionName, image])

    return <Draggable
        resourceType={ResourceType.LAMBDA}
        resourceId={id}
        debug={debug}
        startingPosition={startingPosition}
    >
        <g name="outline">
            {inErrorState && <rect width={66} height={66} stroke="red" strokeDasharray="5,5" fill="none" />}
            <rect width={64} height={64} x={1} y={1} className={`${styles.border} ${selectedResource.id === id ? styles.selected : ''}`} />
            <rect width={62} height={62} x={2} y={2} />
        </g>
        <g transform="scale(0.75), translate(4,4)">
            <LambdaIcon id={id} />
        </g>
        <text x={32} y={75} height={10} dominantBaseline="middle" textAnchor="middle" fill="black" className={styles.resourceText}>{functionName}</text>
    </Draggable>
}

const renderPermissions = (permissions: Permission[]): string => {
    if (permissions.length === 0) {
        return ''
    }
    return `permissions = [
                ${permissions.map(p => `${p.target.resourceType}.${p.target.id}.${p.type}`).join('\n')}
            ]`
}

const renderDependsOn = (permissions: Permission[]): string => {
    if (permissions.length === 0) {
        return ''
    }

    const uniquePermissions: Permission[] = []
    for (const p of permissions) {
        if (!uniquePermissions.find(p => p.target.id === p.target.id)) {
            uniquePermissions.push(p)
        }
    }

    return `depends_on = [
                ${uniquePermissions.map(p => `${p.target.resourceType}.${p.target.id}`).join('\n')}
            ]`
}

const renderEnv = (env: { [key: string]: string }): string => {
    if (Object.keys(env).length === 0) {
        return 'env = {}'
    }

    return `env = {
                ${Object.keys(env).map(e => `${e} = "${env[e]}"`).join('\n')}
            }`
}

export const renderLambdaTF = (state: LambdaResourceState, permissions: Permission[]): string => {
    const str = dedent(`
        resource "${state.resourceType}" "${state.id}" {
            function_name  = "${state.functionName}"
            image = "${state.image}"
            ${renderEnv(state.env ?? {})}
            ${renderPermissions(permissions)}
            ${renderDependsOn(permissions)}
        }    
    `)

    return str.replace(/\s+(\n(?!}))/g, '')
}

export default LambdaResourceViz

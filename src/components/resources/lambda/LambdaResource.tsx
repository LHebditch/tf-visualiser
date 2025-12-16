import { FC, useMemo } from "react";
import { IACResource, Permission } from "../../../state/IAC";
import { Resource, ResourceType, selectedResourceState } from "../../../state/Resource";
import { useAtomValue } from "jotai";
import { ResourceComponent } from "../Resource";
import Draggable from "../../draggable/Draggable";
import styles from "../Resource.module.css"
import dedent from "dedent";

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
        <defs>
            <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id={`${id}-lambda-gradient`}>
                <stop stopColor="#C8511B" offset="0%"></stop>
                <stop stopColor="#FF9900" offset="100%"></stop>
            </linearGradient>
        </defs>
        <g name="outline">
            {inErrorState && <rect width={66} height={66} stroke="red" strokeDasharray="5,5" fill="none" />}
            <rect width={64} height={64} x={1} y={1} className={`${styles.border} ${selectedResource.id === id ? styles.selected : ''}`} />
            <rect width={62} height={62} x={2} y={2} />
        </g>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" name="logo" transform="scale(0.75), translate(4,4)">
            <g fill={`url(#${id}-lambda-gradient)`}>
                <rect x="0" y="0" width="80" height="80"></rect>
            </g>
            <path d="M28.0075352,66 L15.5907274,66 L29.3235885,37.296 L35.5460249,50.106 L28.0075352,66 Z M30.2196674,34.553 C30.0512768,34.208 29.7004629,33.989 29.3175745,33.989 L29.3145676,33.989 C28.9286723,33.99 28.5778583,34.211 28.4124746,34.558 L13.097944,66.569 C12.9495999,66.879 12.9706487,67.243 13.1550766,67.534 C13.3374998,67.824 13.6582439,68 14.0020416,68 L28.6420072,68 C29.0299071,68 29.3817234,67.777 29.5481094,67.428 L37.563706,50.528 C37.693006,50.254 37.6920037,49.937 37.5586944,49.665 L30.2196674,34.553 Z M64.9953491,66 L52.6587274,66 L32.866809,24.57 C32.7014253,24.222 32.3486067,24 31.9617091,24 L23.8899822,24 L23.8990031,14 L39.7197081,14 L59.4204149,55.429 C59.5857986,55.777 59.9386172,56 60.3255148,56 L64.9953491,56 L64.9953491,66 Z M65.9976745,54 L60.9599868,54 L41.25928,12.571 C41.0938963,12.223 40.7410777,12 40.3531778,12 L22.89768,12 C22.3453987,12 21.8963569,12.447 21.8953545,12.999 L21.884329,24.999 C21.884329,25.265 21.9885708,25.519 22.1780103,25.707 C22.3654452,25.895 22.6200358,26 22.8866544,26 L31.3292417,26 L51.1221625,67.43 C51.2885485,67.778 51.6393624,68 52.02626,68 L65.9976745,68 C66.5519605,68 67,67.552 67,67 L67,55 C67,54.448 66.5519605,54 65.9976745,54 L65.9976745,54 Z" fill="#FFFFFF"></path>
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

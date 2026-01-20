import { FC, useMemo } from "react";
import { Resource, ResourceType, selectedResourceState } from "../../../state/Resource";
import { ResourceComponent } from "../Resource";
import { useAtomValue } from "jotai";
import Draggable from "../../draggable/Draggable";
import styles from '../Resource.module.css'
import { IACResource } from "../../../state/IAC";
import dedent from "dedent";
import S3Icon from "../icons/S3Icon";

export type S3ResourceState = Resource & {
    bucketName: string
}

export type S3Resource = IACResource & { state: S3ResourceState }

const S3ResourceViz: FC<S3ResourceState & ResourceComponent> = ({
    id,
    debug,
    startingPosition,
    bucketName
}) => {
    const selectedResource = useAtomValue(selectedResourceState)
    const inErrorState = useMemo(() => {
        return !bucketName
    }, [bucketName])


    return <Draggable
        resourceType={ResourceType.S3}
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
            <S3Icon id={id} />
        </g>
        <text x={32} y={75} height={10} dominantBaseline="middle" textAnchor="middle" fill="black" className={styles.resourceText}>{bucketName}</text>
    </Draggable>
}

export const renderS3ResourceTF = (state: S3ResourceState) => {
    return dedent(`
        resource "${state.resourceType}" "${state.id}" {
            bucket_name = "${state.bucketName}"
        }    
    `)
}

export default S3ResourceViz

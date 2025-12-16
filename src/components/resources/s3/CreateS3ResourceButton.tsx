import { useAtom, useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import { iacState } from "../../../state/IAC";
import { canvasOffsetState } from "../../../state/Canvas";
import { ResourceType } from "../../../state/Resource";
import { type S3Resource } from "./S3Resource";
import { generateResourceId } from "../Resource";

const CreateS3ResourceButton: FC = () => {
    const [iac, setIAC] = useAtom(iacState)
    const currentOffset = useAtomValue(canvasOffsetState)
    const s3Resources = useMemo(() => iac.filter(r => r.state.resourceType === ResourceType.S3), [iac])

    const onClick = () => {
        const s3: S3Resource = {
            state: {
                id: generateResourceId('s3'),
                resourceType: ResourceType.S3,
                bucketName: `bucket_${s3Resources.length}`,
                friendlyName: `bucket_${s3Resources.length}`,

                exportsPermissions: true,
                exportedPermissions: {
                    create_policy: true,
                    read_policy: true,
                    delete_policy: true
                }
            },
            pos: { x: 50 - currentOffset.x, y: 50 - currentOffset.y }
        }

        setIAC([
            ...iac,
            s3
        ])
    }

    return <button className="primary" onClick={onClick}>S3bucket</button>
}

export default CreateS3ResourceButton

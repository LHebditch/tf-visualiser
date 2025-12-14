import { useAtom, useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import { iacState } from "../../../state/IAC";
import { canvasOffsetState } from "../../../state/Canvas";
import { ResourceType } from "../../../state/Resource";
import { generateResourceId } from "../Resource";
import { LambdaResource } from "./LambdaResource";

const CreateLambdaResourceButton: FC = () => {
    const [iac, setIAC] = useAtom(iacState)
    const currentOffset = useAtomValue(canvasOffsetState)
    const lambdaResources = useMemo(() => iac.filter(r => r.state.resourceType === ResourceType.LAMBDA), [iac])

    const onClick = () => {
        const lambda: LambdaResource = {
            state: {
                id: generateResourceId('fn'),
                resourceType: ResourceType.LAMBDA,
                functionName: `function_${lambdaResources.length}`,
                friendlyName: `function_${lambdaResources.length}`,
                image: '',

                exportsPermissions: true,
                permissions: {
                    create_policy: true,
                    read_policy: true,
                    delete_policy: true
                }
            },
            pos: { x: 50 - currentOffset.x, y: 50 - currentOffset.y }
        }

        setIAC([
            ...iac,
            lambda
        ])
    }

    return <button className="primary" onClick={onClick}>Lambda Function</button>
}

export default CreateLambdaResourceButton

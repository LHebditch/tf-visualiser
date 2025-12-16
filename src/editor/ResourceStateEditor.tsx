import { useAtomValue } from "jotai";
import { FC } from "react";
import { iacState } from "../state/IAC";
import { ResourceType, selectedResourceState } from "../state/Resource";
import LambdaStateEditor from "./lambda/LambdaStateEditor";
import { LambdaResource } from "../components/resources/lambda/LambdaResource";
import S3StateEditor from "./s3/S3StateEditor";
import { S3Resource } from "../components/resources/s3/S3Resource";

const ResourceStateEditor: FC = () => {
    const iac = useAtomValue(iacState)
    const { id } = useAtomValue(selectedResourceState)
    const currentResource = iac.find(i => i.state.id === id)

    if (id === '' || !currentResource) {
        return <></>
    }

    return <>
        {
            currentResource.state.resourceType === ResourceType.LAMBDA && <>
                <LambdaStateEditor {...currentResource as LambdaResource} />
            </>
        }
        {
            currentResource.state.resourceType === ResourceType.S3 && <>
                <S3StateEditor {...currentResource as S3Resource} />
            </>
        }
    </>
}

export default ResourceStateEditor
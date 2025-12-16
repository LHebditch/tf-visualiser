import { FC, FormEventHandler, useState } from "react";
import { LambdaResource } from "../../components/resources/lambda/LambdaResource";
import { useAtom } from "jotai";
import { IACResource, iacState, Permission } from "../../state/IAC";
import { PolicyType, Resource, ResourceType } from "../../state/Resource";
import styles from '../Editor.module.css'
import PolicySelector from "../../components/policy_selector/PolicySelector";

const getResourcesWithPermissions = (iac: IACResource[]): Resource[] => {
    return iac.filter(r => r.state.exportsPermissions).map(i => i.state)
}

const LambdaStateEditor: FC<LambdaResource> = ({ state, permissions }) => {
    const [iac, setIAC] = useAtom(iacState)

    const [functionName, setFunctionName] = useState(state.functionName)
    const [image, setImage] = useState(state.image)
    const [policy, setPolicy] = useState<Permission | undefined>(permissions?.length ? permissions[0] : undefined)

    const resourcesWithPermissions = getResourcesWithPermissions(iac).filter(i => i.id !== state.id)

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()

        const resource = iac.find(r => r.state.id === state.id) as LambdaResource
        if (!resource) {
            return
        }

        resource.state.image = image
        resource.state.functionName = functionName
        resource.state.friendlyName = functionName.replace(/-/g, '_').replace(/ /g, '_')

        const newPermissions = permissions?.filter(p => p.source.id !== state.id) ?? []
        if (policy) {
            newPermissions.push({
                type: policy?.type ?? '',
                source: {
                    id: state.id,
                    resourceType: ResourceType.LAMBDA
                },
                target: {
                    id: policy.target.id,
                    resourceType: resourcesWithPermissions.find(i => i.id === policy.target.id)!.resourceType
                }
            })
        }

        resource.permissions = newPermissions

        setIAC([
            ...iac.filter(r => r.state.id != state.id),
            resource,
        ])
    }

    const handlePolicyChange = (id: string, changeType: PolicyType) => {
        if (!id) {
            setPolicy(undefined)
        }
        const resourceType = resourcesWithPermissions.find(i => i.id === id)!.resourceType
        const newPermission: Permission = {
            type: changeType,
            source: {
                id: state.id,
                resourceType: ResourceType.LAMBDA
            },
            target: {
                id: id,
                resourceType: resourceType
            }
        }
        setPolicy(newPermission)
    }

    return <section className={styles.editor}>
        <form onSubmit={handleSubmit}>
            <legend>Configuration</legend>
            <fieldset>
                <div className={styles.fieldWrapper}>
                    <label htmlFor="function-name-input" title="Name of the lambda function">Bucket Name</label>
                    <input
                        spellCheck={false}
                        type="text"
                        name="function_name"
                        id="function-name-input"
                        value={functionName}
                        onChange={e => setFunctionName(e.target.value)}
                    />
                    {!functionName.trim() && <p className={styles.errorText}>Function name is required</p>}
                </div>
                <div className={styles.fieldWrapper}>
                    <label htmlFor="function-image-input" title="Image used by the lambda function">Image</label>
                    <input
                        spellCheck={false}
                        type="text"
                        name="image"
                        id="function-image-input"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                    />
                    {!image.trim() && <p className={styles.errorText}>Image name is required</p>}
                </div>
            </fieldset>
            <legend>Permissions</legend>
            <fieldset>
                <PolicySelector resources={resourcesWithPermissions} onChange={handlePolicyChange} selectedPolicy={policy} />
            </fieldset>

            <button className="primary">Save changes</button>
        </form>
    </section>
}

export default LambdaStateEditor
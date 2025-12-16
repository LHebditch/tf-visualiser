import { ChangeEventHandler, FC } from "react";
import { PolicyType, Resource } from "../../state/Resource";
import { Permission } from "../../state/IAC";
import styles from './PolicySelector.module.css'

type Props = {
    resources: Resource[]
    selectedPolicy?: Permission
    onChange?: (id: string, changeType: PolicyType) => void
}


type AvailablePermission = { id: string, name: string }

const PolicySelector: FC<Props> = ({ resources, selectedPolicy, onChange }) => {
    const createResourceName = (r: Resource): string => {
        return `${r.resourceType}.${r.friendlyName ? r.friendlyName : r.id}`
    }
    const idOfSelected = selectedPolicy ? `${selectedPolicy.target.id},${selectedPolicy.type}` : ''

    const linkInfo = (id: string, name: string, type: PolicyType, suffix: string): AvailablePermission => {
        return {
            id: `${id},${type}`,
            name: `${name}.${suffix}`
        }
    }

    const permissions: AvailablePermission[] = []
    for (const r of resources) {
        const name = createResourceName(r)
        if (r.exportedPermissions?.create_policy) {
            permissions.push(linkInfo(r.id, name, 'create_policy', 'create'))
        }
        if (r.exportedPermissions?.read_policy) {
            permissions.push(linkInfo(r.id, name, 'read_policy', 'read'))
        }
        if (r.exportedPermissions?.update_policy) {
            permissions.push(linkInfo(r.id, name, 'update_policy', 'update'))
        }
        if (r.exportedPermissions?.delete_policy) {
            permissions.push(linkInfo(r.id, name, 'delete_policy', 'delete'))
        }
        if (r.exportedPermissions?.invoke_policy) {
            permissions.push(linkInfo(r.id, name, 'invoke_policy', 'invoke'))
        }
    }

    const handleChange: ChangeEventHandler<HTMLSelectElement> = e => {
        if (!onChange) {
            return
        }
        const value = e.target.value
        const [id, type] = value.split(',')
        onChange(id, type as PolicyType)
    }

    return <>
        <select onChange={handleChange} value={idOfSelected} name="policy-selector" className={styles.select}>
            <option value=','></option>
            {permissions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

    </>
}

export default PolicySelector

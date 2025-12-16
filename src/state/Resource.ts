import { atom } from "jotai"

export enum ResourceType {
    NULL = 'null_resource',
    LAMBDA = 'lambda_function',
    S3 = 's3_bucket'
}

export type PolicyType = '' | 'create_policy' | 'read_policy' | 'update_policy' | 'delete_policy' | 'invoke_policy'

type ResourceExports = {
    [key in PolicyType]?: boolean
}

export type Resource = {
    id: string
    resourceType: ResourceType
    friendlyName: string
    exportsPermissions: boolean
    exportedPermissions: ResourceExports
}

type SelectedResource = {
    id: string,
    resourceType: ResourceType
}

export const selectedResourceState = atom<SelectedResource>({
    id: '',
    resourceType: ResourceType.NULL,
})
import { atom } from 'jotai'
import { type Vector2 } from '../hooks/UseMousePosition'
import { type ResourceType, type Resource, type PolicyType } from './Resource'

export type PermissionTarget = {
    id: string
    resourceType: ResourceType
}
export type Permission = {
    type: PolicyType
    source: PermissionTarget
    target: PermissionTarget
}

export type IACResource = {
    pos: Vector2
    state: Resource

    permissions?: Permission[]
}

export const iacState = atom<IACResource[]>([])

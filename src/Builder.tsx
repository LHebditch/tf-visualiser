import { FC, useEffect, useMemo, useState } from 'react'
import styles from './Builder.module.css'
import { useAtom } from 'jotai'
import { IACResource, iacState, Permission } from './state/IAC'
import { ResourceType, selectedResourceState } from './state/Resource'
import dedent from 'dedent'
import LambdaResourceViz, { LambdaResourceState, renderLambdaTF } from './components/resources/lambda/LambdaResource'
import S3ResourceViz, { renderS3ResourceTF, S3ResourceState } from './components/resources/s3/S3Resource'
import CreateLambdaResourceButton from './components/resources/lambda/CreateLambdaResourceButton'
import CreateS3ResourceButton from './components/resources/s3/CreateS3ResourceButton'
import Canvas from './components/canvas/Canvas'
import ResourceLink from './components/resource_link/ResourceLink'

const DEBUG = false

const Builder: FC = () => {
    const [iac, setIAC] = useAtom(iacState)
    const [selectedResource, setSelectedResource] = useAtom(selectedResourceState)

    const [iacString, setIACString] = useState('')
    const [showDialog, setShowDialog] = useState(false)

    const [lambdaResources, setLambdaResources] = useState<IACResource[]>([])
    const [s3Resources, setS3Resources] = useState<IACResource[]>([])



    useEffect(() => {
        const deleteResource = (id: string) => {
            setSelectedResource({
                id: '',
                resourceType: ResourceType.NULL
            })
            setIAC(iac.filter(r => r.state.id !== id))
        }

        const handleKeyPress = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Delete" && selectedResource.id !== '') {
                deleteResource(selectedResource.id)
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [selectedResource, iac, setIAC, setSelectedResource])

    useEffect(() => {
        const lambda: IACResource[] = []
        const s3: IACResource[] = []
        for (const i of iac) {
            switch (i.state.resourceType) {
                case ResourceType.LAMBDA:
                    lambda.push(i)
                    break
                case ResourceType.S3:
                    s3.push(i)
                    break;
                default:
                    break;
            }
        }

        setLambdaResources(lambda)
        setS3Resources(s3)
    }, [iac])

    const generateIAC = () => {
        const lambdaResourcesTF = lambdaResources.map(l => renderLambdaTF(l.state as LambdaResourceState, l.permissions ?? []))
        const s3ResourcesTF = s3Resources.map(s => renderS3ResourceTF(s.state as S3ResourceState))

        const allResourcesTF = [
            ...s3ResourcesTF,
            lambdaResourcesTF
        ]

        const provider = dedent(`
            provider "aws" {}    
        `)

        setIACString([provider, ...allResourcesTF].join('\n\n'))
        setShowDialog(true)
    }

    const saveIACToClipboard = async () => {
        await navigator.clipboard.writeText(iacString)
        console.log('Copied IAC string to clipboard')
    }

    const getAllPermissions = (allResources: IACResource[]): Permission[] => {
        const perms: Permission[] = []
        for (const r of allResources) {
            perms.push(...(r.permissions ?? []))
        }
        return perms
    }

    const permissions = useMemo(() => getAllPermissions(iac), [iac])

    return <>
        <section className={styles.ui}>
            <div className={styles.header}>
                <hgroup>
                    <h1>Terraform</h1>
                    <h2>Infrastructure builder</h2>
                </hgroup>
                <div className={styles.actionButtons}>
                    <button className='secondary' onClick={() => alert('TODO')}>Export</button>
                    <button className='primary' onClick={generateIAC}>Generate</button>
                </div>
            </div>

            <div className={styles.sidebar}>
                <ul className={styles.buttonList}>
                    <li>
                        <CreateLambdaResourceButton />
                    </li>
                    <li>
                        <CreateS3ResourceButton />
                    </li>
                </ul>
            </div>

            <div className={styles.canvas}>
                <Canvas>
                    <g>
                        {permissions.map(p => <ResourceLink key={`${p.source.id}-${p.target.id}-${p.type}`} {...p} />)}
                    </g>
                    <g>
                        {lambdaResources.map(l => <LambdaResourceViz key={l.state.id} {...l.state as LambdaResourceState} startingPosition={l.pos} debug={DEBUG} />)}
                    </g>
                    <g>
                        {s3Resources.map(s => <S3ResourceViz key={s.state.id} {...s.state as S3ResourceState} startingPosition={s.pos} debug={DEBUG} />)}
                    </g>
                </Canvas>
            </div>
            <div className={styles.editor}>
                <p>TODO</p>
            </div>
        </section>

        <dialog className={styles.dialog} open={showDialog}>
            <pre>
                {iacString}
            </pre>
            <div className={styles.actionButtons}>
                <button className='primary' onClick={saveIACToClipboard}>Copy</button>
                <button className='secondary' onClick={() => setShowDialog(false)}>Close</button>
            </div>
        </dialog>
    </>

}

export default Builder

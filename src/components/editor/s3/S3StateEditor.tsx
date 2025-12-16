import { FC, FormEventHandler, useState } from "react";
import { S3Resource } from "../../../components/resources/s3/S3Resource";
import { useAtom } from "jotai";
import { iacState } from "../../../state/IAC";
import styles from '../Editor.module.css'

const S3StateEditor: FC<S3Resource> = ({ state }) => {
    const [iac, setIAC] = useAtom(iacState)
    const [bucketName, setBucketName] = useState(state.bucketName)

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()

        const resource = iac.find(i => i.state.id === state.id) as S3Resource
        if (!resource) {
            return
        }

        resource.state.bucketName = bucketName
        resource.state.friendlyName = bucketName.replace(/-/g, '_').replace(/ /g, '_')

        setIAC([
            ...iac.filter(i => i.state.id !== state.id),
            resource,
        ])
    }

    return <section className={styles.editor}>
        <form onSubmit={handleSubmit}>
            <legend>Configuration</legend>
            <fieldset>
                <div className={styles.fieldWrapper}>
                    <label htmlFor="bucket-name-input" title="The globally unique name of the S3 bucket">Bucket Name</label>
                    <input
                        spellCheck={false}
                        type="text"
                        name="bucket_name"
                        id="bucket-name-input"
                        value={bucketName}
                        onChange={e => setBucketName(e.target.value)}
                    />
                    {!bucketName.trim() && <p className={styles.errorText}>Bucket name is required</p>}
                </div>
            </fieldset>

            <button className="primary">Save changes</button>
        </form>
    </section>
}

export default S3StateEditor

import { useEffect } from 'react';
import useStore from '../../utils/apiStore';
import BladeSchemaForm from "../../components/SchemaForm/BladeSchemaForm";

const AudioCard = ({ className }) => {
    const setSystemConfig = useStore((state) => state.setSystemConfig)
    const getSystemConfig = useStore((state) => state.getSystemConfig)
    const schema = useStore((state) => state?.schemas?.audio?.schema)
    const model = useStore((state) => state?.config?.audio)

    useEffect(() => {
        getSystemConfig();
    }, []);

    return <div className={className}>
        {schema && <BladeSchemaForm
            schema={schema}
            model={model}
            onModelChange={(e) => {
                setSystemConfig({
                    config: {
                        audio: e
                    }
                }).then(() => getSystemConfig())
            }}
        />}
    </div>
};

export default AudioCard;

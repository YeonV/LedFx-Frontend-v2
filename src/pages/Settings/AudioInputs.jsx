import { useEffect } from 'react';
import useStore from '../../utils/apiStore';
import BladeSchemaFormNew from "../../components/SchemaForm/BladeSchemaFormNew";

const AudioCard = ({ }) => {
    const setSystemConfig = useStore((state) => state.setSystemConfig)
    const getSystemConfig = useStore((state) => state.getSystemConfig)
    const schema = useStore((state) => state?.schemas?.audio?.schema)
    const model = useStore((state) => state?.config?.audio)

    useEffect(() => {
        getSystemConfig();
    }, []);

    return <BladeSchemaFormNew
        schema={schema}
        model={model}
        onModelChange={(e) => {
            setSystemConfig({
                config: {
                    audio: e
                }
            }).then(() => getSystemConfig())
        }}
    />
};

export default AudioCard;

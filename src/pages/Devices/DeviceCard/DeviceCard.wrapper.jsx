import { useState, useEffect } from 'react';
import useStore from '../../../utils/apiStore';
import DeviceCardTry from './DeviceCard'

const DeviceCardWrapper = ({ virtual, index }) => {
  const getVirtuals = useStore((state) => state.getVirtuals);
  const getDevices = useStore((state) => state.getDevices);
  const virtuals = useStore((state) => state.virtuals);
  const devices = useStore((state) => state.devices);
  const deleteVirtual = useStore((state) => state.deleteVirtual);
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice);
  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual);
  const graphs = useStore((state) => state.graphs);
  const clearVirtualEffect = useStore((state) => state.clearVirtualEffect);
  const updateVirtual = useStore((state) => state.updateVirtual);

  const [fade, setFade] = useState(false)
  const [isActive, setIsActive] = useState((virtuals && virtual && virtuals[virtual] && virtuals[virtual].effect && Object.keys(virtuals[virtual].effect)?.length > 0) || devices && devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0)

  const handleDeleteDevice = (virtual) => {
    deleteVirtual(virtuals[virtual]?.id).then(() => {
      getVirtuals();
    });
  };

  const handleEditVirtual = (virtual) => {
    setDialogOpenAddVirtual(true, virtual)
  };
  const handleEditDevice = (device) => {
    setDialogOpenAddDevice(true, device)
  };

  const handleClearEffect = () => {
    clearVirtualEffect(virtual).then(() => {
      setFade(true)
      setTimeout(() => { getVirtuals();getDevices(); }, virtuals[virtual].config.transition_time * 1000)
      setTimeout(() => { setFade(false) }, virtuals[virtual].config.transition_time * 1000 + 300)
    });
  };

  const handlePlayPause = () => {
    updateVirtual(virtuals[virtual].id, { active: !virtuals[virtual].active })
      .then(() => getVirtuals());
  };

  useEffect(() => {        
    setIsActive((virtual && virtuals[virtual] && Object.keys(virtuals[virtual]?.effect)?.length > 0) || devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0)
  }, [virtuals, devices])

  // console.log("yoo", devices[Object.keys(devices).find(d => d === virtual)]?.config.ip_address)
  return virtual && virtuals[virtual] ?
    <DeviceCardTry 
      yzName={virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.name}
      virtId={virtual}
      index={index}
      handleDeleteDevice={()=>handleDeleteDevice(virtual)}
      handleEditVirtual={()=>handleEditVirtual(virtual)}
      handleEditDevice={()=> handleEditDevice(virtuals[virtual]?.is_device)}
      handleClearEffect={()=>handleClearEffect(virtual)}
      handlePlayPause={()=>handlePlayPause()}
      yzLinkTo={`/device/${virtuals[virtual]?.id}`}      
      yzIconName={virtuals[virtual]?.config && virtuals[virtual]?.config.icon_name && virtuals[virtual]?.config.icon_name}
      yzEffectName={virtuals[virtual]?.effect.name}
      yzGraphs={graphs}
      yzIsDevice={virtuals[virtual]?.is_device}
      yzColorIndicator={false}
      isPlaying={virtuals[virtual]?.active}
      yzTransitionTime={virtuals[virtual].config.transition_time * 1000}
      yzIsStreaming={devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0}
      yzPreviewOnly={virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.preview_only}
      yzIsEffectSet={Object.keys(virtuals[virtual]?.effect)?.length > 0}
      yzStyle={{
        order: !(devices[Object.keys(devices).find(d => d === virtual)]?.active_virtuals?.length > 0 || virtuals[virtual]?.effect.name)
          ? 100
          : !virtuals[virtual]?.effect.name
            ? 50
            : 'unset'
      }}
    />

    : <></>
}

export default DeviceCardWrapper

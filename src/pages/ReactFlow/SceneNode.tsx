import useStore from '../../store/useStore'
import SceneCard from '../Scenes/SceneCard'
import useStyles from '../Scenes/Scenes.styles'

const SceneNode = ({ id, data }: { id: string; data: { name: string } }) => {
  const classes = useStyles()
  const scene = useStore((state) => state.scenes[id])
  const features = useStore((state) => state.features)
  const activateScene = useStore((state) => state.activateScene)
  const captivateScene = useStore((state) => state.captivateScene)

  const handleActivateScene = (sceneId: string) => {
    activateScene(sceneId)
    if (scene?.scene_puturl && scene?.scene_payload)
      captivateScene(scene.scene_puturl, scene.scene_payload)
  }

  const sceneData = scene ? { ...scene, name: data.name || scene.name } : { id, name: data.name }

  if (!sceneData) {
    return <div>Scene not found</div>
  }

  return (
    <div style={{ width: 250 }}>
      <SceneCard
        flow
        sceneId={id}
        scene={sceneData}
        order={0}
        handleActivateScene={handleActivateScene}
        features={features}
        classes={classes}
      />
    </div>
  )
}

export default SceneNode

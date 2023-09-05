import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const EditMatrixDnDWrapper = ({
  colNumber,
  rowNumber,
  children,
  dialog
}: any) => {
  return (
    <TransformWrapper
      centerZoomedOut
      initialScale={
        colNumber * 100 < window.innerWidth ||
        rowNumber * 100 < window.innerHeight * 0.8
          ? 1
          : 0.1
      }
      minScale={0.1}
    >
      <TransformComponent>
        <div
          style={{
            width: colNumber * 100,
            height: rowNumber * 100,
            background: '#111',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {children}
          {dialog}
        </div>
      </TransformComponent>
    </TransformWrapper>
  )
}

export default EditMatrixDnDWrapper

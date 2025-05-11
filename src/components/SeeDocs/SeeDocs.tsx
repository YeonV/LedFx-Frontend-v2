import { Link } from '@mui/material'

const SeeDocs = ({ url = 'https://docs.ledfx.app/en/latest/configuring.html' }) => {
  return (
    <Link href={url} target="_blank">
      See Docs
    </Link>
  )
}

export default SeeDocs

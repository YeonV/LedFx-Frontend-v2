import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from '@material-ui/core';
import logo from '../assets/logo.png';
import logoCircle from '../assets/ring.png';
import Guide from '../components/Guide';

export default function Home() {
  return (
    <>
      <div className="Content">
        <div style={{ position: 'relative' }} >
          <img src={logoCircle} className="App-logo" alt="logo-circle" />
          <img src={logo} className="Logo" alt="logo" />
        </div>
      </div>
      <Card
        variant="outlined"
        style={{
          background: '#303030',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <CardHeader title="Welcome to LedFx" />
        <CardContent>
          Complete Frontend Rewrite... from scratch
          <ul>
            <li>Modern React</li>
            <li>Zustand as State-Management</li>
            <li>Typescript supported</li>
            <li>Mobile First</li>
            <li>...</li>
            <li>by Blade</li>
          </ul>
        </CardContent>
        <CardActions>
          <Guide className={'step-one'} />
          <Button disabled variant="outlined">
            Docs
          </Button>
          <Button disabled variant="outlined">
            Scan
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

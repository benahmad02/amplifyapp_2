import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  AmplifySignOut,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import Notes from './modules/Notes';


function App({ signOut }) {
  return (
    <div className="App">
      <Notes />
      <Button onClick={signOut}> Déconnexion </Button>
    </div>
  );
}

export default withAuthenticator(App);

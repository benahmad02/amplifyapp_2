import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";


function App({ signOut }) {
  return (
    <View className="App">
      <Card className="App-header">
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>Authentification Disponible !</Heading>
      </Card>
      <Button onClick={signOut}> Déconnexion </Button>
    </View>
  );
}

export default withAuthenticator(App);
